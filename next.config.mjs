/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // 🔥 THIS creates out/ folder
  allowedDevOrigins: ['192.168.0.132'],
};

export default nextConfig;