export default {
  async fetch(request, env, ctx) {
    try {
      // Get assets binding (supports env.ASSETS or env.__STATIC_CONTENT)
      const assets = env.ASSETS || env.__STATIC_CONTENT;
      
      if (assets) {
        const response = await assets.fetch(request);
        if (response.status !== 404) {
          return response;
        }
        // SPA Fallback for client-side routing
        const url = new URL(request.url);
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return await assets.fetch(indexRequest);
      }

      // Fallback: If no assets binding attached
      return new Response('Assets binding not configured in Worker', { status: 500 });
    } catch (err) {
      // Print exact exception message instead of throwing Error 1101
      return new Response('Worker Exec Error: ' + (err.stack || err.message || err), {
        status: 500,
        headers: { 'content-type': 'text/plain' }
      });
    }
  }
};
