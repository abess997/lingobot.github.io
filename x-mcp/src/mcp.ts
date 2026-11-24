import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Env, PostDraft } from "./env";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  fmtTime,
  listAccounts,
  parsePostId,
  parseRunAt,
  publish,
  resolveAccount,
  resolveAccounts,
  storeImage,
  tweetUrl,
  validateDrafts,
} from "./publish";
import { type Account, type PostWithMetrics, accessToken, deletePost, getMentions, getPosts, getUserPosts, searchRecent } from "./x";

const COST_NOTE =
  "X bills your developer account per post (about $0.015 per post, about $0.20 for a post containing a link, as listed on docs.x.com in Nov 2026; check console.x.com for current rates).";

const draft = z.object({
  text: z.string().describe("The post text."),
  images: z.array(z.string()).max(4).optional().describe("Names of saved images to attach (see list_images), up to 4."),
});

const ok = (text: string) => ({ content: [{ type: "text" as const, text }] });
const fail = (e: unknown) => ({
  content: [{ type: "text" as const, text: e instanceof Error ? e.message : String(e) }],
  isError: true,
});

function wrap<A>(fn: (args: A) => Promise<ReturnType<typeof ok>>) {
  return async (args: A) => {
    try {
      return await fn(args);
    } catch (e) {
      return fail(e);
    }
  };
}

function metricsLine(p: PostWithMetrics): string {
  const m = p.public_metrics;
  if (!m) return "no metrics";
  return [
    m.impression_count != null ? `${m.impression_count} views` : null,
    `${m.like_count} likes`,
    `${m.retweet_count} reposts`,
    `${m.reply_count} replies`,
    `${m.quote_count} quotes`,
    m.bookmark_count != null ? `${m.bookmark_count} bookmarks` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

export function createServer(env: Env): McpServer {
  const server = new McpServer(
    { name: "x-mcp", version: "1.0.0" },
    {
      instructions:
        "Publishes to the user's own X accounts. Before calling publish_post, publish_thread or schedule_posts, " +
        "show the user the exact final text (and images) and get an explicit yes. Never publish a draft the user hasn't approved. " +
        "This server can only post, schedule, delete its posts and read public numbers; it can't like, reply on the user's behalf to others, follow or send messages.",
    },
  );

  server.registerTool(
    "list_accounts",
    {
      title: "List connected X accounts",
      description: "Lists the X accounts connected to this server.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    wrap(async () => {
      const accounts = await listAccounts(env);
      if (!accounts.length) return ok("No X account is connected yet. The user can connect one from the dashboard.");
      return ok(accounts.map((a) => `@${a.username} (${a.name})`).join("\n"));
    }),
  );

  server.registerTool(
    "publish_post",
    {
      title: "Publish a post on X",
      description:
        `Publishes a single post now. Only call after the user approved the exact text. Use accounts: ["all"] or a list of handles to send the same post from several accounts. ${COST_NOTE}`,
      inputSchema: {
        text: z.string().describe("The exact post text the user approved."),
        images: draft.shape.images,
        account: z.string().optional().describe("Handle to post from, e.g. @acme. Optional when only one account is connected."),
        accounts: z.array(z.string()).optional().describe('Post from several accounts: a list of handles, or ["all"].'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    wrap(async ({ text, images, account, accounts }) => {
      const posts: PostDraft[] = [{ text, images }];
      await validateDrafts(env, posts);
      const targets = await resolveAccounts(env, account, accounts);
      const lines: string[] = [];
      for (const acc of targets) {
        try {
          const [p] = await publish(env, acc, posts);
          lines.push(`Posted from @${acc.username}: ${p.url}`);
        } catch (e) {
          lines.push(`Failed for @${acc.username}: ${e instanceof Error ? e.message : e}`);
        }
      }
      return ok(lines.join("\n"));
    }),
  );

  server.registerTool(
    "publish_thread",
    {
      title: "Publish a thread on X",
      description: `Publishes a thread now: each post replies to the one before. Only call after the user approved every post. ${COST_NOTE}`,
      inputSchema: {
        posts: z.array(draft).min(2).max(25).describe("The posts of the thread, in order."),
        account: z.string().optional().describe("Handle to post from. Optional when only one account is connected."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    wrap(async ({ posts, account }) => {
      await validateDrafts(env, posts);
      const acc = await resolveAccount(env, account);
      const out = await publish(env, acc, posts);
      return ok(`Posted a ${out.length}-post thread from @${acc.username}:\n${out.map((p, i) => `${i + 1}. ${p.url}`).join("\n")}`);
    }),
  );

  server.registerTool(
    "schedule_posts",
    {
      title: "Schedule a post or thread",
      description:
        "Schedules a post (one item in posts) or a thread (several) for later. run_at must include a timezone offset; " +
        `if the user gives a local time without one, assume ${env.TIMEZONE} and convert it. Only call after the user approved the text. ${COST_NOTE}`,
      inputSchema: {
        posts: z.array(draft).min(1).max(25).describe("One post, or the posts of a thread in order."),
        run_at: z.string().describe('When to publish, ISO 8601 with offset, e.g. "2026-12-01T09:00:00+03:00".'),
        account: z.string().optional().describe("Handle to post from."),
        accounts: z.array(z.string()).optional().describe('Schedule for several accounts: a list of handles, or ["all"].'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    wrap(async ({ posts, run_at, account, accounts }) => {
      const at = parseRunAt(run_at);
      await validateDrafts(env, posts);
      const targets = await resolveAccounts(env, account, accounts);
      const lines: string[] = [];
      for (const acc of targets) {
        const row = await env.DB.prepare(
          "INSERT INTO scheduled (account_id, posts, run_at, created_at) VALUES (?1, ?2, ?3, ?4) RETURNING id",
        )
          .bind(acc.x_user_id, JSON.stringify(posts), at, Date.now())
          .first<{ id: number }>();
        lines.push(`Scheduled #${row!.id} from @${acc.username} for ${fmtTime(env, at)}.`);
      }
      return ok(lines.join("\n"));
    }),
  );

  server.registerTool(
    "list_scheduled",
    {
      title: "List scheduled posts",
      description: "Lists scheduled posts. By default only those still waiting.",
      inputSchema: {
        include_finished: z.boolean().optional().describe("Also show sent, failed and cancelled ones (last 50)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    wrap(async ({ include_finished }) => {
      const sql = include_finished
        ? "SELECT s.*, a.username FROM scheduled s LEFT JOIN accounts a ON a.x_user_id = s.account_id ORDER BY s.run_at DESC LIMIT 50"
        : "SELECT s.*, a.username FROM scheduled s LEFT JOIN accounts a ON a.x_user_id = s.account_id WHERE s.status = 'pending' ORDER BY s.run_at";
      const { results } = await env.DB.prepare(sql).all<{
        id: number;
        username: string | null;
        posts: string;
        run_at: number;
        status: string;
        error: string | null;
        result: string | null;
      }>();
      if (!results.length) return ok(include_finished ? "Nothing scheduled yet." : "Nothing is waiting to be posted.");
      return ok(
        results
          .map((r) => {
            const posts: PostDraft[] = JSON.parse(r.posts);
            const kind = posts.length > 1 ? `thread of ${posts.length}` : "post";
            const preview = posts[0].text.slice(0, 120).replace(/\s+/g, " ");
            const extra = r.error ? ` Error: ${r.error}` : r.result ? ` ${JSON.parse(r.result).map((p: { url: string }) => p.url).join(" ")}` : "";
            return `#${r.id} [${r.status}] ${kind} from @${r.username ?? "?"} at ${fmtTime(env, r.run_at)}: "${preview}"${extra}`;
          })
          .join("\n"),
      );
    }),
  );

  server.registerTool(
    "reschedule",
    {
      title: "Move a scheduled post",
      description: "Changes when a waiting scheduled post goes out.",
      inputSchema: {
        id: z.number().int().describe("The scheduled post number (#id)."),
        run_at: z.string().describe("New time, ISO 8601 with offset."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    },
    wrap(async ({ id, run_at }) => {
      const at = parseRunAt(run_at);
      const r = await env.DB.prepare("UPDATE scheduled SET run_at = ?1 WHERE id = ?2 AND status = 'pending'").bind(at, id).run();
      if (!r.meta.changes) return fail(`#${id} isn't waiting to be posted (it may already be sent or cancelled).`);
      return ok(`#${id} now goes out ${fmtTime(env, at)}.`);
    }),
  );

  server.registerTool(
    "cancel_scheduled",
    {
      title: "Cancel a scheduled post",
      description: "Cancels a waiting scheduled post.",
      inputSchema: { id: z.number().int().describe("The scheduled post number (#id).") },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    },
    wrap(async ({ id }) => {
      const r = await env.DB.prepare("UPDATE scheduled SET status = 'cancelled' WHERE id = ?1 AND status = 'pending'").bind(id).run();
      if (!r.meta.changes) return fail(`#${id} isn't waiting to be posted (it may already be sent or cancelled).`);
      return ok(`Cancelled #${id}.`);
    }),
  );

  server.registerTool(
    "delete_post",
    {
      title: "Delete a published post",
      description: "Deletes a post from X. Confirm with the user first; this can't be undone.",
      inputSchema: { post: z.string().describe("The post's id or link.") },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
    },
    wrap(async ({ post }) => {
      const id = parsePostId(post);
      const row = await env.DB.prepare("SELECT account_id FROM history WHERE tweet_id = ?1").bind(id).first<{ account_id: string }>();
      let acc: Account | null = null;
      if (row) acc = await env.DB.prepare("SELECT * FROM accounts WHERE x_user_id = ?1").bind(row.account_id).first<Account>();
      if (!acc) {
        const handle = post.match(/x\.com\/([^/]+)\/status|twitter\.com\/([^/]+)\/status/);
        acc = await resolveAccount(env, handle?.[1] ?? handle?.[2]);
      }
      await deletePost(env, await accessToken(env, acc), id);
      await env.DB.prepare("UPDATE history SET deleted_at = ?1 WHERE tweet_id = ?2").bind(Date.now(), id).run();
      return ok(`Deleted ${tweetUrl(acc.username, id)}.`);
    }),
  );

  server.registerTool(
    "post_history",
    {
      title: "What was published",
      description: "Lists posts published through this server, newest first.",
      inputSchema: {
        limit: z.number().int().min(1).max(100).optional().describe("How many (default 20)."),
        account: z.string().optional().describe("Only this handle."),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    wrap(async ({ limit, account }) => {
      const acc = account ? await resolveAccount(env, account) : null;
      const stmt = acc
        ? env.DB.prepare("SELECT * FROM history WHERE account_id = ?1 ORDER BY posted_at DESC LIMIT ?2").bind(acc.x_user_id, limit ?? 20)
        : env.DB.prepare("SELECT * FROM history ORDER BY posted_at DESC LIMIT ?1").bind(limit ?? 20);
      const { results } = await stmt.all<{ tweet_id: string; username: string; text: string; posted_at: number; deleted_at: number | null }>();
      if (!results.length) return ok("Nothing has been published through this server yet.");
      return ok(
        results
          .map((r) => `${fmtTime(env, r.posted_at)} @${r.username}${r.deleted_at ? " [deleted]" : ""}: "${r.text.slice(0, 100).replace(/\s+/g, " ")}" ${tweetUrl(r.username, r.tweet_id)}`)
          .join("\n"),
      );
    }),
  );

  server.registerTool(
    "post_stats",
    {
      title: "How posts did",
      description:
        "Public numbers (views, likes, reposts, replies, quotes, bookmarks) for given posts, or for an account's latest posts. Each post read is billed by X (about $0.005).",
      inputSchema: {
        posts: z.array(z.string()).max(100).optional().describe("Post ids or links."),
        latest: z.number().int().min(1).max(100).optional().describe("Or: this many of the account's latest posts (default 10)."),
        account: z.string().optional().describe("Account for `latest`, and whose sign-in reads the numbers."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    wrap(async ({ posts, latest, account }) => {
      const acc = await resolveAccount(env, account);
      const token = await accessToken(env, acc);
      const items = posts?.length
        ? await getPosts(env, token, posts.map(parsePostId))
        : await getUserPosts(env, token, acc.x_user_id, latest ?? 10);
      if (!items.length) return ok("No posts found.");
      return ok(
        items
          .map((p) => `${p.created_at ?? ""} ${tweetUrl(acc.username, p.id)}\n  "${p.text.slice(0, 140).replace(/\s+/g, " ")}"\n  ${metricsLine(p)}`)
          .join("\n"),
      );
    }),
  );

  server.registerTool(
    "my_mentions",
    {
      title: "Recent mentions",
      description: "Recent public posts that mention an account. Each post read is billed by X (about $0.005).",
      inputSchema: {
        account: z.string().optional(),
        max: z.number().int().min(5).max(100).optional().describe("How many (default 20)."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    wrap(async ({ account, max }) => {
      const acc = await resolveAccount(env, account);
      const res = await getMentions(env, await accessToken(env, acc), acc.x_user_id, max ?? 20);
      const users = new Map((res.includes?.users ?? []).map((u) => [u.id, u.username]));
      if (!res.data?.length) return ok(`No recent mentions of @${acc.username}.`);
      return ok(
        res.data
          .map((p) => {
            const who = users.get(p.author_id) ?? p.author_id;
            return `@${who} ${p.created_at ?? ""} ${tweetUrl(who, p.id)}\n  "${p.text.slice(0, 200).replace(/\s+/g, " ")}"\n  ${metricsLine(p)}`;
          })
          .join("\n"),
      );
    }),
  );

  server.registerTool(
    "search_posts",
    {
      title: "Search recent public posts",
      description:
        'Searches public posts from the last 7 days with X search syntax (e.g. "from:somebody", "#topic -is:retweet lang:ar"). Each post read is billed by X (about $0.005).',
      inputSchema: {
        query: z.string().min(1).max(512),
        max: z.number().int().min(10).max(100).optional().describe("How many (default 10)."),
        account: z.string().optional().describe("Whose sign-in to use. Optional."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    wrap(async ({ query, max, account }) => {
      const acc = await resolveAccount(env, account);
      const res = await searchRecent(env, await accessToken(env, acc), query, max ?? 10);
      const users = new Map((res.includes?.users ?? []).map((u) => [u.id, u.username]));
      if (!res.data?.length) return ok("No matching posts in the last 7 days.");
      return ok(
        res.data
          .map((p) => {
            const who = users.get(p.author_id) ?? p.author_id;
            return `@${who} ${p.created_at ?? ""} ${tweetUrl(who, p.id)}\n  "${p.text.slice(0, 200).replace(/\s+/g, " ")}"\n  ${metricsLine(p)}`;
          })
          .join("\n"),
      );
    }),
  );

  server.registerTool(
    "save_image",
    {
      title: "Save an image from a link",
      description: "Downloads an image from a public https link and saves it under a name to attach to posts later. JPG, PNG, GIF or WEBP, up to 5 MB.",
      inputSchema: {
        name: z.string().describe('A short name to refer to it by, e.g. "launch graphic".'),
        url: z.string().url().describe("Public https link to the image."),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    wrap(async ({ name, url }) => {
      if (!url.startsWith("https://")) return fail("Use an https link.");
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) return fail(`Couldn't download it (${res.status}).`);
      const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      if (!IMAGE_TYPES.includes(type)) return fail(`That link isn't a JPG, PNG, GIF or WEBP image (it's ${type || "unknown"}).`);
      const len = Number(res.headers.get("content-length") || 0);
      if (len > MAX_IMAGE_BYTES) return fail("Images must be 5 MB or smaller (X's limit).");
      await storeImage(env, name, await res.arrayBuffer(), type);
      return ok(`Saved "${name.trim()}". Attach it with images: ["${name.trim()}"].`);
    }),
  );

  server.registerTool(
    "list_images",
    {
      title: "List saved images",
      description: "Lists saved images by name.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    wrap(async () => {
      const { results } = await env.DB.prepare("SELECT * FROM images ORDER BY created_at DESC").all<{ name: string; content_type: string; size: number }>();
      if (!results.length) return ok("No images saved yet. Upload them on the dashboard, or use save_image with a link.");
      return ok(results.map((r) => `"${r.name}" (${r.content_type}, ${Math.ceil(r.size / 1024)} KB)`).join("\n"));
    }),
  );

  server.registerTool(
    "delete_image",
    {
      title: "Delete a saved image",
      description: "Deletes a saved image (it stays on any post it was already published with).",
      inputSchema: { name: z.string() },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    },
    wrap(async ({ name }) => {
      const r = await env.DB.prepare("DELETE FROM images WHERE name = ?1").bind(name).run();
      if (!r.meta.changes) return fail(`There's no saved image called "${name}".`);
      await env.IMAGES.delete(name);
      return ok(`Deleted "${name}".`);
    }),
  );

  return server;
}
