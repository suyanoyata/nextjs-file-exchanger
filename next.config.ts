import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jfpjjbzwwxtbenedhjci.supabase.co",
      },
    ],
  },
};

export default nextConfig;
