import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  // Ensure turbopack resolves the correct workspace root (avoids duplicate dependency resolution)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow accessing the dev server from the local network for HMR (adjust if your host/port differ)
  // Add the host:port that you open in the browser (example: http://192.168.1.42:3000)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.42:3000',
  ],
};

export default nextConfig;
