/**
 * Alternative routing layer: Cloudflare Worker.
 *
 * Use this INSTEAD OF Next.js rewrites if:
 *   - You want non-Vercel tools (Streamlit, Rails, FastAPI) at sypher.in/<slug>
 *   - You want shared edge caching across tools
 *   - You want to do things rewrites can't (geo-routing, A/B testing)
 *
 * Deploy with `wrangler deploy`. Map the route sypher.in/* to this Worker
 * in Cloudflare's Workers Routes panel.
 */

const TOOL_TARGETS = {
  'reel-hooks': 'https://sypher-tool-reel-hooks.vercel.app',
  'yt-summarizer': 'https://sypher-tool-yt-summarizer.vercel.app',
  // Add new tools here.
};

const SHELL_TARGET = 'https://sypher-shell.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // /reel-hooks/* and similar: route to the tool's deployment
    if (firstSegment && Object.prototype.hasOwnProperty.call(TOOL_TARGETS, firstSegment)) {
      const target = TOOL_TARGETS[firstSegment];
      const upstreamUrl = `${target}${url.pathname}${url.search}`;

      const upstreamReq = new Request(upstreamUrl, request);
      // Forward original Host so Vercel logs / cookie analytics see sypher.in
      upstreamReq.headers.set('X-Forwarded-Host', url.host);
      upstreamReq.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

      const upstreamRes = await fetch(upstreamReq);

      // Don't let upstream set a cookie scoped to a vercel.app domain — rewrite
      // any Set-Cookie headers to the apex.
      return rewriteSetCookieDomain(upstreamRes, '.sypher.in');
    }

    // Everything else (including /, /login, /account, /blog): route to shell
    const upstreamUrl = `${SHELL_TARGET}${url.pathname}${url.search}`;
    const upstreamReq = new Request(upstreamUrl, request);
    upstreamReq.headers.set('X-Forwarded-Host', url.host);
    upstreamReq.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    const res = await fetch(upstreamReq);
    return rewriteSetCookieDomain(res, '.sypher.in');
  },
};

function rewriteSetCookieDomain(res, domain) {
  const headers = new Headers(res.headers);
  const cookies = headers.getSetCookie?.() ?? [];
  if (cookies.length === 0) return res;

  headers.delete('set-cookie');
  for (const cookie of cookies) {
    const rewritten = cookie
      .replace(/Domain=[^;]+/i, `Domain=${domain}`)
      .replace(/^(?!.*Domain=)([^;]+)/i, `$1; Domain=${domain}`);
    headers.append('Set-Cookie', rewritten);
  }

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
