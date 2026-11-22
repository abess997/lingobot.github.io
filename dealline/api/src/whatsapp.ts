// WhatsApp Business Platform (Cloud API), Meta's official API. Each org connects its own number;
// Deal Line holds one Meta app (app secret + verify token in env) and each org's access token, encrypted.

export type WaOutgoing =
  | { kind: "text"; body: string }
  | { kind: "template"; name: string; language: string; params: string[] };

export interface WhatsAppClient {
  send(a: { phoneNumberId: string; token: string; to: string; message: WaOutgoing }): Promise<{ id: string }>;
}

export function metaWhatsApp(version: string, fetchFn: typeof fetch = fetch): WhatsAppClient {
  return {
    async send({ phoneNumberId, token, to, message }) {
      const body =
        message.kind === "text"
          ? { messaging_product: "whatsapp", to: to.replace(/^\+/, ""), type: "text", text: { body: message.body } }
          : {
              messaging_product: "whatsapp", to: to.replace(/^\+/, ""), type: "template",
              template: {
                name: message.name, language: { code: message.language },
                components: message.params.length
                  ? [{ type: "body", parameters: message.params.map((text) => ({ type: "text", text })) }] : [],
              },
            };
      const r = await fetchFn(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = (await r.json().catch(() => ({}))) as any;
      if (!r.ok) throw new Error(`whatsapp ${r.status}: ${j?.error?.message ?? "error"}`.slice(0, 300));
      return { id: j.messages?.[0]?.id as string };
    },
  };
}

/** Business-initiated free text is only allowed within 24h of the customer's last message; otherwise use a template. */
export const WINDOW_HOURS = 24;
