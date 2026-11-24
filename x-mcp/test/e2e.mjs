import crypto from "node:crypto";
const B = "http://127.0.0.1:8787";
let pass = 0, failN = 0;
const check = (name, cond, extra = "") => { if (cond) { pass++; console.log("PASS", name); } else { failN++; console.log("FAIL", name, extra); } };
const cookiesOf = (res) => (res.headers.getSetCookie?.() || []).map(c => c.split(";")[0]);
const jar = new Map();
const keep = (res) => cookiesOf(res).forEach(c => { const [k, ...v] = c.split("="); jar.set(k, v.join("=")); });
const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
const f = (p, o = {}) => fetch(B + p, { redirect: "manual", ...o, headers: { Cookie: cookie(), ...(o.headers || {}) } });

// 1. login
let r = await f("/login", { method: "POST", body: new URLSearchParams({ password: "wrong" }) });
check("wrong password rejected", r.status === 401);
r = await f("/x/connect", { method: "POST" });
check("owner routes hidden without session", r.status === 404);
r = await f("/login", { method: "POST", body: new URLSearchParams({ password: "test-password-123" }) }); keep(r);
check("login ok", r.status === 303 && jar.size > 0);
r = await f("/"); let html = await r.text();
check("dashboard shows", html.includes("حساباتك في X") && html.includes(`${B}/mcp`));

// 2. connect X
r = await f("/x/connect", { method: "POST" });
const loc = new URL(r.headers.get("location"));
check("redirects to X authorize", loc.origin + loc.pathname === "https://x.com/i/oauth2/authorize" && loc.searchParams.get("code_challenge_method") === "S256" && loc.searchParams.get("scope").includes("media.write"));
r = await fetch(`${B}/x/callback?state=bogus&code=c`, { redirect: "manual" });
check("callback rejects bad state", decodeURIComponent(r.headers.get("location")).includes("error"));
r = await fetch(`${B}/x/callback?state=${loc.searchParams.get("state")}&code=abc`, { redirect: "manual" });
const cbLoc = decodeURIComponent(r.headers.get("location"));
check("callback links @acme", cbLoc.includes("@acme"), cbLoc);
r = await fetch(`${B}/x/callback?state=${loc.searchParams.get("state")}&code=abc`, { redirect: "manual" });
check("state is single-use", decodeURIComponent(r.headers.get("location")).includes("error"));

// 3. upload image via dashboard (1x1 png)
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
const fd = new FormData(); fd.append("name", "launch graphic"); fd.append("file", new Blob([png], { type: "image/png" }), "a.png");
r = await f("/images", { method: "POST", body: fd });
check("image upload", decodeURIComponent(r.headers.get("location") || "").includes("ok="));
r = await f("/images/file/launch%20graphic");
check("image served to owner", r.status === 200 && r.headers.get("content-type") === "image/png");
r = await fetch(`${B}/images/file/launch%20graphic`);
check("image hidden from others", r.status === 404);

// 4. MCP without token
r = await fetch(`${B}/mcp`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream" }, body: "{}" });
check("mcp needs token (401 + challenge)", r.status === 401 && (r.headers.get("www-authenticate") || "").includes("resource_metadata"), r.status);
r = await fetch(`${B}/.well-known/oauth-protected-resource/mcp`);
let prm = r.ok ? await r.json() : await (await fetch(`${B}/.well-known/oauth-protected-resource`)).json();
check("protected resource metadata", prm.resource === `${B}/mcp`, JSON.stringify(prm));
r = await fetch(`${B}/.well-known/oauth-authorization-server`); const asm = await r.json();
check("AS metadata has DCR", !!asm.registration_endpoint, JSON.stringify(asm).slice(0, 200));

// 5. DCR + authorize as Claude would
r = await fetch(B + asm.registration_endpoint.replace(B, ""), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ client_name: "Claude", redirect_uris: ["https://claude.ai/api/mcp/auth_callback"], token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"] }) });
const client = await r.json();
check("client registered", !!client.client_id, JSON.stringify(client));
const verifier = crypto.randomBytes(32).toString("base64url");
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
const aq = new URLSearchParams({ response_type: "code", client_id: client.client_id, redirect_uri: "https://claude.ai/api/mcp/auth_callback", code_challenge: challenge, code_challenge_method: "S256", state: "st1", resource: `${B}/mcp` });
// fresh browser (no owner session) -> must show password field
const jar2 = new Map();
r = await fetch(`${B}/authorize?${aq}`, { redirect: "manual" });
cookiesOf(r).forEach(c => { const [k, ...v] = c.split("="); jar2.set(k, v.join("=")); });
html = await r.text();
const handle = html.match(/name="handle" value="([^"]+)"/)?.[1]?.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
check("consent page with password field", !!handle && html.includes('name="password"') && html.includes("claude.ai"), r.status + html.slice(0, 300));
const c2 = () => [...jar2].map(([k, v]) => `${k}=${v}`).join("; ");
r = await fetch(`${B}/authorize`, { method: "POST", redirect: "manual", headers: { Cookie: c2() }, body: new URLSearchParams({ handle, decision: "approve", password: "nope" }) });
check("consent rejects wrong password", r.status === 401);
r = await fetch(`${B}/authorize`, { method: "POST", redirect: "manual", headers: { Cookie: c2() }, body: new URLSearchParams({ handle, decision: "approve", password: "test-password-123" }) });
const back = new URL(r.headers.get("location") || "http://none");
check("consent approved -> code", back.origin === "https://claude.ai" && back.searchParams.get("code") && back.searchParams.get("state") === "st1", r.status + " " + back);
r = await fetch(B + "/oauth/token", { method: "POST", body: new URLSearchParams({ grant_type: "authorization_code", code: back.searchParams.get("code"), redirect_uri: "https://claude.ai/api/mcp/auth_callback", client_id: client.client_id, code_verifier: verifier, resource: `${B}/mcp` }) });
const tok = await r.json();
check("token issued", !!tok.access_token && !!tok.refresh_token, JSON.stringify(tok));

// 6. MCP calls
let rid = 0;
async function rpc(method, params) {
  const res = await fetch(`${B}/mcp`, { method: "POST", headers: { authorization: `Bearer ${tok.access_token}`, "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++rid, method, params }) });
  const t = await res.text();
  try { return JSON.parse(t); } catch { return { raw: t, status: res.status }; }
}
const call = async (name, args = {}) => { const j = await rpc("tools/call", { name, arguments: args }); return { text: j.result?.content?.[0]?.text ?? JSON.stringify(j), err: !!j.result?.isError || !!j.error }; };
let j = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } });
check("initialize", j.result?.serverInfo?.name === "x-mcp", JSON.stringify(j).slice(0, 300));
j = await rpc("tools/list", {});
const names = j.result?.tools?.map(t => t.name) || [];
console.log("tools:", names.join(", "));
check("15 tools listed", names.length === 15, names.length);
let c;
c = await call("list_accounts"); check("list_accounts", c.text.includes("@acme"), c.text);
c = await call("publish_post", { text: "Hello from test", images: ["launch graphic"] }); check("publish_post w/ image", !c.err && c.text.includes("https://x.com/acme/status/"), c.text);
c = await call("publish_post", { text: "x", images: ["nope"] }); check("publish_post missing image rejected before sending", c.err && c.text.includes("nope"), c.text);
c = await call("publish_post", { text: "x", account: "@ghost" }); check("unknown account rejected", c.err && c.text.includes("ghost"), c.text);
c = await call("publish_thread", { posts: [{ text: "1/3" }, { text: "2/3" }, { text: "3/3" }] }); check("publish_thread", !c.err && (c.text.match(/status\//g) || []).length === 3, c.text);
c = await call("publish_thread", { posts: [{ text: "ok 1" }, { text: "FAIL 2" }] }); check("thread partial failure reported", c.err && c.text.includes("Already published 1 of 2"), c.text);
c = await call("schedule_posts", { posts: [{ text: "later" }], run_at: "2026-12-01T09:00:00" }); check("schedule needs offset", c.err && c.text.includes("offset"), c.text);
c = await call("schedule_posts", { posts: [{ text: "past" }], run_at: "2020-01-01T09:00:00Z" }); check("schedule rejects past", c.err, c.text);
const soon = new Date(Date.now() + 3000).toISOString();
c = await call("schedule_posts", { posts: [{ text: "scheduled one", images: ["launch graphic"] }, { text: "scheduled two" }], run_at: soon }); check("schedule_posts", !c.err && c.text.includes("Scheduled #"), c.text);
const sid = Number(c.text.match(/#(\d+)/)?.[1]);
c = await call("schedule_posts", { posts: [{ text: "to cancel" }], run_at: "2027-01-01T09:00:00+03:00" }); const cid = Number(c.text.match(/#(\d+)/)?.[1]);
c = await call("reschedule", { id: cid, run_at: "2027-01-02T10:00:00+03:00" }); check("reschedule", !c.err && c.text.includes("2 Jan 2027"), c.text);
c = await call("list_scheduled"); check("list_scheduled", c.text.includes(`#${cid}`) && c.text.includes("pending"), c.text);
c = await call("cancel_scheduled", { id: cid }); check("cancel_scheduled", !c.err, c.text);
c = await call("cancel_scheduled", { id: cid }); check("cancel twice rejected", c.err, c.text);
await new Promise(r => setTimeout(r, 4000));
r = await fetch(`${B}/__scheduled?cron=*+*+*+*+*`); await r.text();
await new Promise(r => setTimeout(r, 1500));
c = await call("list_scheduled", { include_finished: true }); check("cron published scheduled thread", new RegExp(`#${sid} \\[sent\\]`).test(c.text) && c.text.includes("x.com/acme/status"), c.text);
c = await call("post_history", { limit: 5 }); check("post_history", c.text.includes("scheduled two"), c.text);
const someId = c.text.match(/status\/(\d+)/)[1];
c = await call("delete_post", { post: `https://x.com/acme/status/${someId}?s=20` }); check("delete_post by link", !c.err && c.text.includes(someId), c.text);
c = await call("post_history", { limit: 10 }); check("history marks deleted", c.text.includes("[deleted]"), c.text);
c = await call("post_stats", { posts: [someId] }); check("post_stats ids", c.text.includes("500 views") && c.text.includes("10 likes"), c.text);
c = await call("post_stats", { latest: 5 }); check("post_stats latest", c.text.includes("latest"), c.text);
c = await call("my_mentions"); check("my_mentions", c.text.includes("@fan"), c.text);
c = await call("search_posts", { query: "#launch lang:ar" }); check("search_posts", c.text.includes("@other"), c.text);
c = await call("list_images"); check("list_images", c.text.includes("launch graphic"), c.text);
c = await call("save_image", { name: "x", url: "http://example.com/a.png" }); check("save_image rejects http", c.err, c.text);
c = await call("delete_image", { name: "launch graphic" }); check("delete_image", !c.err, c.text);

// 7. token refresh path: first X token had expires_in 60s (<120s margin) -> must have refreshed
const xlog = await (await fetch("http://127.0.0.1:8788/_log")).json();
const grants = xlog.filter(e => e.p === "/2/oauth2/token").map(e => new URLSearchParams(e.body).get("grant_type"));
check("X token refreshed and rotated", grants[0] === "authorization_code" && grants.includes("refresh_token"), grants.join(","));
const posts = xlog.filter(e => e.p === "/2/tweets" && e.m === "POST").map(e => JSON.parse(e.body));
check("thread replies chained", posts.some(p => p.reply?.in_reply_to_tweet_id), "");
check("media attached", posts.some(p => p.media?.media_ids?.length === 1), "");

// 8. refresh our own MCP token
r = await fetch(B + "/oauth/token", { method: "POST", body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: tok.refresh_token, client_id: client.client_id }) });
check("MCP token refresh", !!(await r.json()).access_token);

console.log(`\n${pass} passed, ${failN} failed`);
process.exit(failN ? 1 : 0);
