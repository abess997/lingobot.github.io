import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { Env } from "./env";
import { createServer } from "./mcp";
import { runDuePosts } from "./publish";
import { handleWeb, originOf } from "./web";

/** The MCP endpoint. Only reached with a valid access token (checked by OAuthProvider). */
const mcpHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Stateless: a fresh server per request, JSON responses, no session to keep.
    const server = createServer(env);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};

const providers = new Map<string, OAuthProvider<Env>>();

function providerFor(origin: string): OAuthProvider<Env> {
  let p = providers.get(origin);
  if (!p) {
    p = new OAuthProvider<Env>({
      apiRoute: "/mcp",
      apiHandler: mcpHandler as never,
      defaultHandler: { fetch: (req, env) => handleWeb(req as Request, env as Env) },
      authorizeEndpoint: "/authorize",
      tokenEndpoint: "/oauth/token",
      clientRegistrationEndpoint: "/oauth/register",
      clientIdMetadataDocumentEnabled: true,
      scopesSupported: ["x"],
      resourceMetadata: { resource: `${origin}/mcp`, authorization_servers: [origin] },
      accessTokenTTL: 3600,
      refreshTokenTTL: 90 * 86400,
    });
    providers.set(origin, p);
  }
  return p;
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return providerFor(originOf(request, env)).fetch(request, env, ctx);
  },
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      runDuePosts(env).then((r) => {
        if (r.sent || r.failed) console.log(`scheduled posts: ${r.sent} sent, ${r.failed} failed`);
      }),
    );
  },
} satisfies ExportedHandler<Env>;
