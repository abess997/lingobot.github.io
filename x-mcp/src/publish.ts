import type { Env, PostDraft } from "./env";
import { type Account, XError, accessToken, createPost, uploadImage } from "./x";

export const MAX_IMAGES_PER_POST = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // X's limit for tweet_image
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const tweetUrl = (username: string, id: string) => `https://x.com/${username}/status/${id}`;

export function fmtTime(env: Env, ms: number): string {
  const local = new Intl.DateTimeFormat("en-GB", {
    timeZone: env.TIMEZONE || "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
  return `${local} (${env.TIMEZONE || "UTC"})`;
}

export async function listAccounts(env: Env): Promise<Account[]> {
  const { results } = await env.DB.prepare("SELECT * FROM accounts ORDER BY created_at").all<Account>();
  return results;
}

/** Finds an account by @handle, handle or user id; with none given, the only connected account. */
export async function resolveAccount(env: Env, handle?: string): Promise<Account> {
  const accounts = await listAccounts(env);
  if (!accounts.length) throw new Error("No X account is connected yet. Open the dashboard and connect one first.");
  if (!handle) {
    if (accounts.length === 1) return accounts[0];
    throw new Error(
      `Several accounts are connected (${accounts.map((a) => "@" + a.username).join(", ")}). Say which one to use.`,
    );
  }
  const h = handle.trim().replace(/^@/, "").toLowerCase();
  const found = accounts.find((a) => a.username.toLowerCase() === h || a.x_user_id === h);
  if (!found)
    throw new Error(`@${h} isn't connected. Connected: ${accounts.map((a) => "@" + a.username).join(", ")}.`);
  return found;
}

export async function resolveAccounts(env: Env, account?: string, accounts?: string[]): Promise<Account[]> {
  if (accounts?.length) {
    if (accounts.length === 1 && accounts[0].toLowerCase() === "all") {
      const all = await listAccounts(env);
      if (!all.length) throw new Error("No X account is connected yet.");
      return all;
    }
    const out: Account[] = [];
    for (const a of accounts) {
      const acc = await resolveAccount(env, a);
      if (!out.some((o) => o.x_user_id === acc.x_user_id)) out.push(acc);
    }
    return out;
  }
  return [await resolveAccount(env, account)];
}

/** Checks a draft before anything is sent, so a thread doesn't fail halfway on a missing image. */
export async function validateDrafts(env: Env, posts: PostDraft[]): Promise<void> {
  if (!posts.length) throw new Error("Nothing to post.");
  for (const [i, p] of posts.entries()) {
    if (!p.text?.trim() && !p.images?.length) throw new Error(`Post ${i + 1} is empty.`);
    if ((p.images?.length ?? 0) > MAX_IMAGES_PER_POST)
      throw new Error(`Post ${i + 1} has more than ${MAX_IMAGES_PER_POST} images (X's limit).`);
    for (const name of p.images ?? []) {
      const row = await env.DB.prepare("SELECT name FROM images WHERE name = ?1").bind(name).first();
      if (!row) throw new Error(`There's no saved image called "${name}". Use list_images to see the names.`);
    }
  }
}

async function mediaIdsFor(env: Env, token: string, names: string[] = []): Promise<string[]> {
  const ids: string[] = [];
  for (const name of names) {
    const obj = await env.IMAGES.get(name);
    if (!obj) throw new Error(`Image "${name}" is missing from storage.`);
    ids.push(await uploadImage(env, token, await obj.arrayBuffer(), obj.httpMetadata?.contentType || "image/png"));
  }
  return ids;
}

export type Published = { id: string; url: string }[];

/**
 * Publishes one post, or a thread (each post replies to the one before).
 * On a failure partway through a thread, what was already published is reported in the error.
 */
export async function publish(env: Env, account: Account, posts: PostDraft[], scheduledId?: number): Promise<Published> {
  const token = await accessToken(env, account);
  const done: Published = [];
  let previous: string | undefined;
  try {
    for (const p of posts) {
      const mediaIds = await mediaIdsFor(env, token, p.images);
      const id = await createPost(env, token, p.text ?? "", { replyTo: previous, mediaIds });
      done.push({ id, url: tweetUrl(account.username, id) });
      await env.DB.prepare(
        `INSERT INTO history (tweet_id, account_id, username, text, thread_root, scheduled_id, posted_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
      )
        .bind(id, account.x_user_id, account.username, p.text ?? "", posts.length > 1 ? done[0].id : null, scheduledId ?? null, Date.now())
        .run();
      previous = id;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const partial = done.length ? ` Already published ${done.length} of ${posts.length}: ${done.map((d) => d.url).join(" ")}` : "";
    throw new XError(`${msg}${partial}`, e instanceof XError ? e.status : 500);
  }
  return done;
}

/** Called every minute by the cron trigger. */
export async function runDuePosts(env: Env): Promise<{ sent: number; failed: number }> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM scheduled WHERE status = 'pending' AND run_at <= ?1 ORDER BY run_at LIMIT 20",
  )
    .bind(Date.now())
    .all<{ id: number; account_id: string; posts: string }>();
  let sent = 0;
  let failed = 0;
  for (const job of results) {
    // Claim it, so an overlapping run can't send it twice.
    const claim = await env.DB.prepare("UPDATE scheduled SET status = 'sending' WHERE id = ?1 AND status = 'pending'")
      .bind(job.id)
      .run();
    if (!claim.meta.changes) continue;
    try {
      const account = await env.DB.prepare("SELECT * FROM accounts WHERE x_user_id = ?1").bind(job.account_id).first<Account>();
      if (!account) throw new Error("The account was disconnected.");
      const out = await publish(env, account, JSON.parse(job.posts), job.id);
      await env.DB.prepare("UPDATE scheduled SET status = 'sent', result = ?1 WHERE id = ?2")
        .bind(JSON.stringify(out), job.id)
        .run();
      sent++;
    } catch (e) {
      await env.DB.prepare("UPDATE scheduled SET status = 'failed', error = ?1 WHERE id = ?2")
        .bind(e instanceof Error ? e.message : String(e), job.id)
        .run();
      failed++;
    }
  }
  return { sent, failed };
}

/** Parses an ISO 8601 time that carries its own offset ("2026-12-01T09:00:00+03:00" or "...Z"). */
export function parseRunAt(value: string): number {
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(value.trim()))
    throw new Error('Give the time with its timezone offset, for example "2026-12-01T09:00:00+03:00".');
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) throw new Error(`"${value}" isn't a valid date and time.`);
  if (ms < Date.now() - 60_000) throw new Error("That time is in the past.");
  if (ms > Date.now() + 366 * 86_400_000) throw new Error("Posts can be scheduled up to a year ahead.");
  return ms;
}

export function parsePostId(value: string): string {
  const m = value.trim().match(/(?:status(?:es)?\/)?(\d{5,20})\/?(?:\?.*)?$/);
  if (!m) throw new Error(`"${value}" isn't a post id or post link.`);
  return m[1];
}

/** Saves an image under a name, from bytes already in hand. */
export async function storeImage(env: Env, name: string, bytes: ArrayBuffer, contentType: string): Promise<void> {
  const clean = name.trim();
  if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{0,79}$/u.test(clean))
    throw new Error("Image names can use letters, numbers, spaces, dots, dashes and underscores (up to 80).");
  if (!IMAGE_TYPES.includes(contentType)) throw new Error(`X accepts JPG, PNG, GIF or WEBP images, not ${contentType}.`);
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error("Images must be 5 MB or smaller (X's limit).");
  await env.IMAGES.put(clean, bytes, { httpMetadata: { contentType } });
  await env.DB.prepare(
    `INSERT INTO images (name, content_type, size, created_at) VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT (name) DO UPDATE SET content_type = ?2, size = ?3, created_at = ?4`,
  )
    .bind(clean, contentType, bytes.byteLength, Date.now())
    .run();
}
