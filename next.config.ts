import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The stylesheets are small and most visitors arrive once, from a shared link: putting the CSS in the page
  // removes four render-blocking requests (see node_modules/next/dist/docs, inlineCss).
  experimental: { inlineCss: true },
  // The classic site at /old was retired; old links land on the home page.
  async redirects() {
    return [{ source: "/old", destination: "/", permanent: true }];
  },
};

export default nextConfig;
