#!/bin/bash
# End-to-end test against a fake X API: npm test
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
cleanup() { kill "${XPID:-}" "${WPID:-}" 2>/dev/null || true; rm -rf "$TMP" wrangler.test.json .dev.vars.test-backup; }
trap cleanup EXIT
# Same config, but fetch() may reach the local fake X server.
node -e '
const fs=require("fs");const c=JSON.parse(fs.readFileSync("wrangler.jsonc","utf8").replace(/\/\/.*$/gm,""));
c.compatibility_flags=["nodejs_compat"];c.vars.X_API_BASE="http://127.0.0.1:8788";
fs.writeFileSync("wrangler.test.json",JSON.stringify(c));'
cat > "$TMP/vars" <<'V'
OWNER_PASSWORD=test-password-123
APP_SECRET=0123456789abcdef0123456789abcdef0123456789
X_CLIENT_ID=fake-client
X_CLIENT_SECRET=fake-secret
V
node test/fake-x.mjs & XPID=$!
npx wrangler d1 migrations apply x-mcp --local -c wrangler.test.json --persist-to "$TMP/state" >/dev/null 2>&1
npx wrangler dev -c wrangler.test.json --env-file "$TMP/vars" --persist-to "$TMP/state" --port 8787 --ip 127.0.0.1 --test-scheduled >"$TMP/dev.log" 2>&1 & WPID=$!
for _ in $(seq 1 60); do curl -s -o /dev/null http://127.0.0.1:8787/ && break; sleep 1; done
node test/e2e.mjs
