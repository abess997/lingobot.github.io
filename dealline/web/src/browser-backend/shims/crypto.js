// Browser stand-in for the parts of node:crypto the API uses (audited: auth.ts, events.ts,
// automation.ts, integrations.ts). Built on audited @noble libraries; same algorithms and
// output formats as Node, so data written here has the same shape as on the server.
import { Buffer } from "buffer";
import { sha256 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { gcm } from "@noble/ciphers/aes.js";

const bytes = (d, enc) => (typeof d === "string" ? Buffer.from(d, enc ?? "utf8") : Buffer.from(d));

export function randomBytes(n) {
  const b = Buffer.alloc(n);
  globalThis.crypto.getRandomValues(b);
  return b;
}

class Digest {
  constructor(fn) { this.fn = fn; this.parts = []; }
  update(d, enc) { this.parts.push(bytes(d, enc)); return this; }
  digest(enc) {
    const out = Buffer.from(this.fn(Buffer.concat(this.parts)));
    return enc ? out.toString(enc) : out;
  }
}
export function createHash(alg) {
  if (alg !== "sha256") throw new Error(`hash ${alg} not available in the browser build`);
  return new Digest((m) => sha256(m));
}
export function createHmac(alg, key) {
  if (alg !== "sha256") throw new Error(`hmac ${alg} not available in the browser build`);
  const k = bytes(key);
  return new Digest((m) => hmac(sha256, k, m));
}

export function scrypt(password, salt, keylen, opts, cb) {
  scryptAsync(bytes(password), bytes(salt), { N: opts.N, r: opts.r, p: opts.p, dkLen: keylen, maxmem: opts.maxmem })
    .then((k) => cb(null, Buffer.from(k)), (e) => cb(e));
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) throw new RangeError("Input buffers must have the same byte length");
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a[i] ^ b[i];
  return r === 0;
}

// AES-256-GCM, streaming API reduced to what events.ts calls: update() then final().
export function createCipheriv(alg, key, iv) {
  if (alg !== "aes-256-gcm") throw new Error(`cipher ${alg} not available`);
  const parts = [];
  let tag = null;
  return {
    update(d, enc) { parts.push(bytes(d, enc)); return Buffer.alloc(0); },
    final() {
      const sealed = gcm(Uint8Array.from(key), Uint8Array.from(iv)).encrypt(Buffer.concat(parts));
      tag = Buffer.from(sealed.slice(sealed.length - 16));
      return Buffer.from(sealed.slice(0, sealed.length - 16));
    },
    getAuthTag() { return tag; },
  };
}
export function createDecipheriv(alg, key, iv) {
  if (alg !== "aes-256-gcm") throw new Error(`cipher ${alg} not available`);
  const parts = [];
  let tag = null;
  return {
    setAuthTag(t) { tag = Buffer.from(t); },
    update(d) { parts.push(bytes(d)); return Buffer.alloc(0); },
    final() {
      return Buffer.from(gcm(Uint8Array.from(key), Uint8Array.from(iv)).decrypt(Buffer.concat([...parts, tag])));
    },
  };
}
