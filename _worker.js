const ENGLISH_HOST = "www.originmindos.com";
const CHINESE_HOST = "www.originmindos.cn";

function isChinese(hostname) {
  return hostname === "originmindos.cn" || hostname.endsWith(".originmindos.cn");
}

function canonicalHost(hostname) {
  if (hostname === "originmindos.com") return ENGLISH_HOST;
  if (hostname === "originmindos.cn") return CHINESE_HOST;
  return null;
}

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  return new Request(url, request);
}

function withSiteHeaders(response, language) {
  const headers = new Headers(response.headers);
  headers.set("Content-Language", language === "zh" ? "zh-CN" : "en");
  headers.set("Vary", "Host");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectHost = canonicalHost(url.hostname.toLowerCase());
    if (redirectHost) {
      url.hostname = redirectHost;
      return Response.redirect(url.toString(), 308);
    }

    const language = isChinese(url.hostname.toLowerCase()) ? "zh" : "en";
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const response = await env.ASSETS.fetch(assetRequest(request, language === "zh" ? "/zh/" : "/en/"));
      return withSiteHeaders(response, language);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.headers.get("accept")?.includes("text/html") !== true) {
      return withSiteHeaders(response, language);
    }

    const fallback = await env.ASSETS.fetch(assetRequest(request, language === "zh" ? "/errors/zh/" : "/errors/en/"));
    const headers = new Headers(fallback.headers);
    headers.set("Content-Language", language === "zh" ? "zh-CN" : "en");
    headers.set("Cache-Control", "no-store");
    return new Response(fallback.body, { status: 404, headers });
  },
};
