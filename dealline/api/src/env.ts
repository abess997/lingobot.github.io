import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8787),
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url(),                 // dashboard, e.g. https://app.dealline.sa
  SITES_ROOT_DOMAIN: z.string().min(3),      // tenant sites at {slug}.SITES_ROOT_DOMAIN
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Deal Line <no-reply@example.com>"),
  MOYASAR_PUBLISHABLE_KEY: z.string().optional(),
  MOYASAR_SECRET_KEY: z.string().optional(),
  MOYASAR_WEBHOOK_SECRET: z.string().optional(),
  SECRETS_KEY: z.string().optional(),          // 32 random bytes, base64: encrypts per-org tokens/secrets
  WHATSAPP_APP_SECRET: z.string().optional(),  // Meta app secret: signs incoming webhooks
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_GRAPH_VERSION: z.string().regex(/^v\d+\.\d+$/).default("v24.0"),
});

export type Env = z.infer<typeof schema>;
export const loadEnv = (src: Record<string, string | undefined> = process.env): Env => {
  const env = schema.parse(src);
  if (env.NODE_ENV === "production") {
    for (const k of ["RESEND_API_KEY", "MOYASAR_SECRET_KEY", "MOYASAR_WEBHOOK_SECRET", "SECRETS_KEY"] as const)
      if (!env[k]) throw new Error(`${k} is required in production`);
    if (env.MOYASAR_SECRET_KEY?.startsWith("sk_test_"))
      console.warn("MOYASAR_SECRET_KEY is a test key in production");
  }
  return env;
};
