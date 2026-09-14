export default {
  async fetch(request, env, ctx) {
    try {
      // 1. Serve static asset directly from Cloudflare Assets binding
      const response = await env.ASSETS.fetch(request);
      
      // If asset exists and is served cleanly, return it
      if (response.status !== 404) {
        return response;
      }

      // 2. Single Page Application (SPA) Fallback to index.html for non-asset routes
      const url = new URL(request.url);
      const indexRequest = new Request(new URL('/index.html', url.origin), request);
      return await env.ASSETS.fetch(indexRequest);
    } catch (err) {
      // 3. Fallback error handler (prevents Cloudflare Error 1101)
      return new Response('App Loading Error', { status: 500 });
    }
  }
};
