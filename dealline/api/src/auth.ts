import { createHash, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Db, Q } from "./db.js";

const scrypt = promisify(_scrypt) as (p: string, s: Buffer, n: number, o: object) => Promise<Buffer>;
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}
export async function verifyPassword(pw: string, stored: string) {
  const [alg, s, k] = stored.split("$");
  if (alg !== "scrypt" || !s || !k) return false;
  const key = await scrypt(pw, Buffer.from(s, "base64"), 64, SCRYPT);
  const want = Buffer.from(k, "base64");
  return want.length === key.length && timingSafeEqual(key, want);
}

export const newToken = () => randomBytes(32).toString("base64url");
export const sha256 = (t: string) => createHash("sha256").update(t).digest("hex");
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const COOKIE = "dl_session";
const SESSION_DAYS = 30;

export async function createSession(q: Q, c: Context, userId: string, secure: boolean) {
  const token = newToken();
  await q.query(
    `insert into sessions (user_id, token_hash, expires_at) values ($1, $2, now() + interval '${SESSION_DAYS} days')`,
    [userId, sha256(token)],
  );
  setCookie(c, COOKIE, token, {
    httpOnly: true, secure, sameSite: "Lax", path: "/", maxAge: SESSION_DAYS * 86400,
  });
}

export function clearSessionCookie(c: Context) {
  deleteCookie(c, COOKIE, { path: "/" });
}

export type Member = { orgId: string; role: "owner" | "admin" | "member" };
export type Vars = { userId: string; member: Member | null };

/** Requires a valid session. Loads the user's org membership (one org per user in this module). */
export const requireUser = (db: Db): MiddlewareHandler<{ Variables: Vars }> => async (c, next) => {
  const token = getCookie(c, COOKIE);
  if (!token) return c.json({ error: "unauthenticated" }, 401);
  const r = await db.asSystem((q) =>
    q.query(
      `select s.user_id, m.org_id, m.role from sessions s
         join users u on u.id = s.user_id
         left join memberships m on m.user_id = s.user_id
        where s.token_hash = $1 and s.expires_at > now()
        order by m.created_at limit 1`,
      [sha256(token)],
    ),
  );
  const row = r.rows[0];
  if (!row) return c.json({ error: "unauthenticated" }, 401);
  c.set("userId", row.user_id);
  c.set("member", row.org_id ? { orgId: row.org_id, role: row.role } : null);
  await next();
};
