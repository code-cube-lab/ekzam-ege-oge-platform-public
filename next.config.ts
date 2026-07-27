import type { NextConfig } from "next";

const isStaticExport = process.env.EKZAM_STATIC_EXPORT === "1";
const githubPagesBasePath = process.env.EKZAM_GITHUB_PAGES_BASE;

const nextConfig: NextConfig = {
  // GitHub Pages hosts only static files. This switch produces a separate
  // browser-only build while preserving the regular server build for Telegram,
  // payments and protected API routes.
  ...(isStaticExport
    ? { output: "export", trailingSlash: true, pageExtensions: ["tsx"] }
    : {}),
  ...(isStaticExport && githubPagesBasePath
    ? { basePath: githubPagesBasePath }
    : {}),
  ...(isStaticExport
    ? {
        turbopack: {
          resolveAlias: {
            "cloudflare:workers": "./build/static-cloudflare-workers.ts",
          },
        },
        experimental: {
          cpus: 1,
        },
      }
    : {}),
};

export default nextConfig;
