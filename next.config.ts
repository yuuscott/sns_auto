import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // AI API呼び出し用のタイムアウト延長
  serverExternalPackages: ['@anthropic-ai/sdk', '@google/genai'],
};

export default nextConfig;
