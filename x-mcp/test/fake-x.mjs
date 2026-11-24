import http from "node:http";
const log = [];
let n = 1000;
const send = (res, code, obj) => { res.writeHead(code, {"content-type":"application/json"}); res.end(JSON.stringify(obj)); };
http.createServer((req, res) => {
  let body = ""; req.on("data", c => body += c); req.on("end", () => {
    const u = new URL(req.url, "http://x");
    log.push({ m: req.method, p: u.pathname, auth: req.headers.authorization?.slice(0,12), body: body.slice(0,300) });
    if (u.pathname === "/_log") return send(res, 200, log);
    if (u.pathname === "/2/oauth2/token") {
      const f = new URLSearchParams(body);
      if (!req.headers.authorization?.startsWith("Basic ")) return send(res, 401, {error:"no basic"});
      if (f.get("grant_type") === "authorization_code" && !f.get("code_verifier")) return send(res, 400, {error:"no verifier"});
      // short expiry on first grant so the refresh path is exercised
      return send(res, 200, { access_token: "at-" + (++n), refresh_token: "rt-" + n, expires_in: f.get("grant_type")==="authorization_code" ? 60 : 7200 });
    }
    if (!req.headers.authorization?.startsWith("Bearer at-")) return send(res, 401, {title:"Unauthorized"});
    if (u.pathname === "/2/users/me") return send(res, 200, {data:{id:"42",username:"acme",name:"Acme Co"}});
    if (u.pathname === "/2/media/upload") { const j = JSON.parse(body); if (!j.media || !j.media_category) return send(res,400,{detail:"bad media"}); return send(res, 200, {data:{id:"m"+(++n), media_key:"3_"+n}}); }
    if (u.pathname === "/2/tweets" && req.method === "POST") { const j = JSON.parse(body); if (j.text.includes("FAIL")) return send(res, 403, {detail:"You are not allowed to create a Tweet with duplicate content."}); return send(res, 201, {data:{id:String(++n)+"00000", text:j.text}}); }
    if (u.pathname.startsWith("/2/tweets/") && req.method === "DELETE") return send(res, 200, {data:{deleted:true}});
    const pm = {retweet_count:2,reply_count:1,like_count:10,quote_count:0,bookmark_count:3,impression_count:500};
    if (u.pathname === "/2/tweets") return send(res, 200, {data:(u.searchParams.get("ids")||"").split(",").map(id=>({id,text:"post "+id,created_at:"2026-11-20T10:00:00Z",public_metrics:pm}))});
    if (/^\/2\/users\/42\/tweets$/.test(u.pathname)) return send(res, 200, {data:[{id:"111111",text:"latest",public_metrics:pm}]});
    if (/^\/2\/users\/42\/mentions$/.test(u.pathname)) return send(res, 200, {data:[{id:"222222",text:"@acme hi",author_id:"7",public_metrics:pm}],includes:{users:[{id:"7",username:"fan"}]}});
    if (u.pathname === "/2/tweets/search/recent") return send(res, 200, {data:[{id:"333333",text:"about "+u.searchParams.get("query"),author_id:"8",public_metrics:pm}],includes:{users:[{id:"8",username:"other"}]}});
    send(res, 404, {title:"not mocked "+u.pathname});
  });
}).listen(8788, "127.0.0.1");
