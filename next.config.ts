import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [`${process.env.NEXT_PUBLIC_ASSET_DOMAIN}`],
  },
};

export default nextConfig;
