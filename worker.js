export default {
  async fetch(request, env) {
    // Serve static assets via Cloudflare Assets routing
    return env.ASSETS.fetch(request);
  }
};
