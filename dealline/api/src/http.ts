import type { Context } from "hono";
import type { z } from "zod";

export class HttpError extends Error {
  constructor(public status: 400 | 401 | 403 | 404 | 409 | 422 | 429, message: string) { super(message); }
}
export const deny = () => new HttpError(403, "forbidden");
export const notFound = () => new HttpError(404, "not_found");

export async function body<T extends z.ZodTypeAny>(c: Context, s: T): Promise<z.infer<T>> {
  let raw: unknown;
  try { raw = await c.req.json(); } catch { throw new HttpError(400, "invalid_json"); }
  return s.parse(raw);
}
