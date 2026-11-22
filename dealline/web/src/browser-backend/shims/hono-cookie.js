// Browser build only. Fetch forbids the Cookie / Set-Cookie headers on Request/Response objects
// created in JavaScript, so the in-tab API cannot see or set the session cookie the normal way.
// This keeps hono/cookie's behaviour and mirrors the session through two plain headers that only
// travel between the UI and the in-tab API (never over a network): x-dl-cookie and x-dl-set-cookie.
import * as real from "../../../../api/node_modules/hono/dist/helper/cookie/index.js";

const parse = (raw) => Object.fromEntries(raw.split(";").map((p) => p.trim()).filter(Boolean).map((p) => {
  const i = p.indexOf("=");
  return [p.slice(0, i), decodeURIComponent(p.slice(i + 1))];
}));

export function getCookie(c, key, ...rest) {
  const raw = c.req.header("x-dl-cookie");
  if (raw == null) return real.getCookie(c, key, ...rest);
  const all = parse(raw);
  return key === undefined ? all : all[key];
}
export function setCookie(c, name, value, opt) {
  real.setCookie(c, name, value, opt);
  c.header("x-dl-set-cookie", `${name}=${encodeURIComponent(value)}`, { append: true });
}
export function deleteCookie(c, name, opt) {
  const out = real.deleteCookie(c, name, opt);
  c.header("x-dl-set-cookie", `${name}=; Max-Age=0`, { append: true });
  return out;
}
export const { getSignedCookie, setSignedCookie, generateCookie, generateSignedCookie } = real;
