// Minimal X API v2 client (OAuth 2.0 user context).
// Endpoints checked against docs.x.com, November 2026.
import { bytesToBase64, decrypt, encrypt } from "./crypto";
import type { Env } from "./env";

export const X_SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access", "media.write"];
export const X_AUTHORIZE_URL = "https://x.com/i/oauth2/authorize";

const api = (env: Env) => env.X_API_BASE || "https://api.x.com";

export class XError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export type Account = {
  x_user_id: string;
  username: string;
  name: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: number;
};

type TokenResponse = { access_token: string; refresh_token?: string; expires_in: number };

async function tokenRequest(env: Env, body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${api(env)}/2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({ ...body, client_id: env.X_CLIENT_ID }),
  });
  if (!res.ok) throw new XError(`X token request failed (${res.status}): ${await res.text()}`, res.status);
  return res.json();
}

export function exchangeCode(env: Env, code: string, verifier: string, redirectUri: string) {
  return tokenRequest(env, {
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });
}

/** Stores (or updates) an account after the X sign-in. */
export async function saveAccount(env: Env, tokens: TokenResponse): Promise<{ username: string }> {
  const me = await xFetch<{ data: { id: string; username: string; name: string } }>(
    env,
    tokens.access_token,
    "/2/users/me",
  );
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO accounts (x_user_id, username, name, access_token, refresh_token, expires_at, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT (x_user_id) DO UPDATE SET username = ?2, name = ?3, access_token = ?4,
       refresh_token = ?5, expires_at = ?6`,
  )
    .bind(
      me.data.id,
      me.data.username,
      me.data.name,
      await encrypt(env.APP_SECRET, tokens.access_token),
      tokens.refresh_token ? await encrypt(env.APP_SECRET, tokens.refresh_token) : null,
      now + tokens.expires_in * 1000,
      now,
    )
    .run();
  return { username: me.data.username };
}

/** Returns a valid access token, refreshing it when it's about to expire. */
export async function accessToken(env: Env, account: Account): Promise<string> {
  if (account.expires_at - Date.now() > 120_000) return decrypt(env.APP_SECRET, account.access_token);
  if (!account.refresh_token)
    throw new XError(`@${account.username}'s X sign-in expired. Reconnect it from the dashboard.`, 401);
  const tokens = await tokenRequest(env, {
    grant_type: "refresh_token",
    refresh_token: await decrypt(env.APP_SECRET, account.refresh_token),
  });
  // X rotates refresh tokens: the old one stops working, so store the new one right away.
  const sealedAccess = await encrypt(env.APP_SECRET, tokens.access_token);
  const sealedRefresh = tokens.refresh_token ? await encrypt(env.APP_SECRET, tokens.refresh_token) : account.refresh_token;
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  await env.DB.prepare("UPDATE accounts SET access_token = ?1, refresh_token = ?2, expires_at = ?3 WHERE x_user_id = ?4")
    .bind(sealedAccess, sealedRefresh, expiresAt, account.x_user_id)
    .run();
  Object.assign(account, { access_token: sealedAccess, refresh_token: sealedRefresh, expires_at: expiresAt });
  return tokens.access_token;
}

export async function xFetch<T>(env: Env, token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${api(env)}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = text;
    try {
      const j = JSON.parse(text);
      detail = j.detail || j.title || j.errors?.[0]?.message || text;
    } catch {}
    const hint =
      res.status === 402 || /credit/i.test(detail)
        ? " (your X developer account may be out of API credits; top up at console.x.com)"
        : res.status === 429
          ? " (X rate limit reached; try again later)"
          : "";
    throw new XError(`X API ${res.status}: ${detail}${hint}`, res.status);
  }
  const json = text ? JSON.parse(text) : {};
  // X can answer 200 with only an `errors` array.
  if (json && !json.data && Array.isArray(json.errors) && json.errors.length)
    throw new XError(`X API: ${json.errors[0].detail || json.errors[0].message}`, res.status);
  return json as T;
}

export async function createPost(
  env: Env,
  token: string,
  text: string,
  opts: { replyTo?: string; mediaIds?: string[] } = {},
): Promise<string> {
  const body: Record<string, unknown> = { text };
  if (opts.replyTo) body.reply = { in_reply_to_tweet_id: opts.replyTo };
  if (opts.mediaIds?.length) body.media = { media_ids: opts.mediaIds };
  const res = await xFetch<{ data: { id: string } }>(env, token, "/2/tweets", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data.id;
}

export async function deletePost(env: Env, token: string, id: string): Promise<boolean> {
  const res = await xFetch<{ data: { deleted: boolean } }>(env, token, `/2/tweets/${id}`, { method: "DELETE" });
  return res.data.deleted;
}

/** Uploads an image (JPG, PNG, GIF or WEBP, up to 5 MB) and returns its media id. */
export async function uploadImage(env: Env, token: string, bytes: ArrayBuffer, contentType: string): Promise<string> {
  const category = contentType === "image/gif" ? "tweet_gif" : "tweet_image";
  const res = await xFetch<{ data: { id: string } }>(env, token, "/2/media/upload", {
    method: "POST",
    body: JSON.stringify({ media: bytesToBase64(bytes), media_category: category }),
  });
  return res.data.id;
}

export type Metrics = {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count?: number;
  impression_count?: number;
};
export type PostWithMetrics = { id: string; text: string; created_at?: string; public_metrics?: Metrics };

export async function getPosts(env: Env, token: string, ids: string[]): Promise<PostWithMetrics[]> {
  const q = new URLSearchParams({ ids: ids.join(","), "tweet.fields": "public_metrics,created_at" });
  const res = await xFetch<{ data?: PostWithMetrics[] }>(env, token, `/2/tweets?${q}`);
  return res.data ?? [];
}

export async function getUserPosts(env: Env, token: string, userId: string, max: number): Promise<PostWithMetrics[]> {
  const q = new URLSearchParams({
    max_results: String(Math.min(100, Math.max(5, max))),
    "tweet.fields": "public_metrics,created_at",
    exclude: "replies,retweets",
  });
  const res = await xFetch<{ data?: PostWithMetrics[] }>(env, token, `/2/users/${userId}/tweets?${q}`);
  return (res.data ?? []).slice(0, max);
}

export async function getMentions(env: Env, token: string, userId: string, max: number) {
  const q = new URLSearchParams({
    max_results: String(Math.min(100, Math.max(5, max))),
    "tweet.fields": "public_metrics,created_at,author_id",
    expansions: "author_id",
    "user.fields": "username",
  });
  return xFetch<{ data?: (PostWithMetrics & { author_id: string })[]; includes?: { users?: { id: string; username: string }[] } }>(
    env,
    token,
    `/2/users/${userId}/mentions?${q}`,
  );
}

export async function searchRecent(env: Env, token: string, query: string, max: number) {
  const q = new URLSearchParams({
    query,
    max_results: String(Math.min(100, Math.max(10, max))),
    "tweet.fields": "public_metrics,created_at,author_id",
    expansions: "author_id",
    "user.fields": "username",
  });
  return xFetch<{ data?: (PostWithMetrics & { author_id: string })[]; includes?: { users?: { id: string; username: string }[] } }>(
    env,
    token,
    `/2/tweets/search/recent?${q}`,
  );
}
