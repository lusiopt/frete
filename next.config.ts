import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NODE_ENV === 'production' ? '/frete' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/frete' : '',
  output: 'standalone',
};

export default nextConfig;
