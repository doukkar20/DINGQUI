import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split("/").pop();
const hasConfiguredBasePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const configuredBasePath =
  hasConfiguredBasePath
    ? process.env.NEXT_PUBLIC_BASE_PATH || ""
    : isGithubPages && githubRepositoryName
      ? `/${githubRepositoryName}`
      : "";

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: configuredBasePath,
  },
  images: {
    unoptimized: true,
  },
  ...(configuredBasePath
    ? {
        assetPrefix: configuredBasePath,
        basePath: configuredBasePath,
      }
    : {}),
};

export default nextConfig;
