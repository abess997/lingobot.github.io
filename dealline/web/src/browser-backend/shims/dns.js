// No DNS from a browser tab. Custom-domain verification and the webhook SSRF check
// need the real server; in the browser build they fail closed.
const unavailable = async () => { throw new Error("ENOTFOUND: DNS is not available in the browser build"); };
export const resolveTxt = unavailable;
export const lookup = unavailable;
export default { resolveTxt, lookup };
