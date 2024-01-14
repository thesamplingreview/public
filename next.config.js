/** @type {import('next').NextConfig} */
console.log(process.env);
const nextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.APP_URL,
    NEXT_PUBLIC_NAME: process.env.APP_NAME,
    NEXT_PUBLIC_DEBUG: process.env.APP_DEBUG,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
