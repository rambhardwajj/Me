import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The classic site at /old was retired; old links land on the home page.
  async redirects() {
    return [{ source: "/old", destination: "/", permanent: true }];
  },
};

export default nextConfig;
