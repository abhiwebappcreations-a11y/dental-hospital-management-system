export default {
  async fetch(request, env, ctx) {
    try {
      if (env && env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
      return await fetch(request);
    } catch (err) {
      return new Response("Resource not found", { status: 404 });
    }
  }
};
