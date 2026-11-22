import { Buffer } from "buffer";

// buffer@6 (the npm polyfill) has no "base64url"; the API uses it for session/auth tokens.
const toString = Buffer.prototype.toString;
Buffer.prototype.toString = function (encoding, start, end) {
  if (encoding === "base64url") return toString.call(this, "base64", start, end).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return toString.call(this, encoding, start, end);
};
const from = Buffer.from;
Buffer.from = function (value, encoding, length) {
  if (encoding === "base64url" && typeof value === "string") return from.call(Buffer, value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  return from.call(Buffer, value, encoding, length);
};

globalThis.Buffer ??= Buffer;
