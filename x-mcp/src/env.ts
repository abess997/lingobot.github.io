import type { OAuthHelpers } from "@cloudflare/workers-oauth-provider";

export interface Env {
  OAUTH_KV: KVNamespace;
  DB: D1Database;
  IMAGES: R2Bucket;
  OAUTH_PROVIDER: OAuthHelpers;

  TIMEZONE: string;
  /** Optional: the public origin, e.g. https://x-mcp.you.workers.dev. Defaults to the request's origin. */
  PUBLIC_URL?: string;

  OWNER_PASSWORD: string;
  APP_SECRET: string;
  X_CLIENT_ID: string;
  X_CLIENT_SECRET: string;
  /** Tests only: overrides https://api.x.com. */
  X_API_BASE?: string;
}

export type PostDraft = { text: string; images?: string[] };
