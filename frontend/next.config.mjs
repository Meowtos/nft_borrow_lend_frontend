/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    APTOS_ABI: process.env.APTOS_ABI,
    APTOS_NETWORK: process.env.APTOS_NETWORK,
    MOVEMENT_ABI: process.env.MOVEMENT_ABI,
    MOVEMENT_NETWORK: process.env.MOVEMENT_NETWORK,
    MOVEMENT_RPC: process.env.MOVEMENT_RPC,
    MOVEMENT_INDEXER: process.env.MOVEMENT_INDEXER,
    SUPRA_ABI: process.env.SUPRA_ABI,
    SUPRA_RPC: process.env.SUPRA_RPC,
    BACKEND_URL: process.env.BACKEND_URL,
    TRADEPORT_INDEXER: process.env.TRADEPORT_INDEXER,
  }
};

export default nextConfig;
