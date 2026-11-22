import { z } from "zod";

export const saPhone = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s-]/g, ""))
  .refine((s) => /^(?:\+9665|009665|9665|05)\d{8}$/.test(s), "رقم جوال سعودي غير صحيح")
  .transform((s) => "+9665" + s.slice(-8));

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const httpsUrl = z.string().url().max(500).refine((u) => u.startsWith("https://"), "https only");
export const FONTS = ["IBM Plex Sans Arabic", "Tajawal", "Cairo", "Noto Kufi Arabic", "Almarai"] as const;

export const siteInput = z.object({
  slug: z.string().regex(/^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$/),
  title: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(160).nullish(),
  template: z.enum(["classic", "modern", "minimal"]).default("classic"),
  logo_url: httpsUrl.nullish(),
  theme: z.object({ primary: hex, accent: hex, font: z.enum(FONTS) }).partial().default({}),
  seo: z.object({
    title: z.string().max(70), description: z.string().max(160), og_image: httpsUrl,
  }).partial().default({}),
  contact_phone: saPhone.nullish(),
  contact_whatsapp: saPhone.nullish(),
  contact_email: z.string().email().max(200).nullish(),
});

export const RESERVED_SLUGS = new Set(["www", "app", "api", "admin", "mail", "static", "cdn", "help", "status"]);

export const listingInput = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().max(5000).nullish(),
  purpose: z.enum(["sale", "rent"]),
  property_type: z.enum(["apartment", "villa", "floor", "land", "building", "office", "shop", "warehouse", "other"]),
  price_halalas: z.number().int().min(0).max(1e14),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().max(60).nullish(),
  area_sqm: z.number().positive().max(1e9).nullish(),
  bedrooms: z.number().int().min(0).max(50).nullish(),
  bathrooms: z.number().int().min(0).max(50).nullish(),
  lat: z.number().min(-90).max(90).nullish(),
  lng: z.number().min(-180).max(180).nullish(),
  images: z.array(httpsUrl).max(30).default([]),
  ad_license_number: z.string().trim().regex(/^[0-9A-Za-z-]{4,30}$/).nullish(),
  ad_license_expires_on: z.string().date().nullish(),
  show_on_site: z.boolean().default(true),
});

export const publicLeadInput = z.object({
  name: z.string().trim().min(1).max(120),
  phone: saPhone,
  email: z.string().email().max(200).nullish(),
  message: z.string().trim().max(2000).nullish(),
  listing_id: z.string().uuid().nullish(),
  source_channel: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{1,30}$/).nullish(), // snapchat, tiktok, google...
  utm_source: z.string().max(100).nullish(),
  utm_medium: z.string().max(100).nullish(),
  utm_campaign: z.string().max(150).nullish(),
  website: z.string().max(500).optional(), // honeypot: hidden field; bots fill it, humans never see it
});

export const hostname = z.string().trim().toLowerCase().max(253).regex(/^[a-z0-9.-]+\.[a-z]{2,}$/);
