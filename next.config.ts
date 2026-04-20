import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

import path from "path";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ["svgo"],
  // @ts-ignore
  allowedDevOrigins: ['192.168.100.5'],
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.100.5']
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
