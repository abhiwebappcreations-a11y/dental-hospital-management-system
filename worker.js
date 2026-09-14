export default {
  async fetch(request, env, ctx) {
    // Serve static assets directly from the ASSETS binding
    const response = await env.ASSETS.fetch(request);
    
    // Fallback to index.html for SPA routing if asset returns 404
    if (response.status === 404) {
      const url = new URL(request.url);
      return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
    }
    
    return response;
  }
};
