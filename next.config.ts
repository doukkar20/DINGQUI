import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/DINGQUI" : "",
  },
  images: {
    unoptimized: true,
  },
  ...(isGithubPages
    ? {
        assetPrefix: "/DINGQUI",
        basePath: "/DINGQUI",
      }
    : {}),
};

export default nextConfig;
