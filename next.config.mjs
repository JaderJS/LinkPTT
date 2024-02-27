/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    URL_SOCKET: process.env.URL_SOCKET,
  },
};

export default nextConfig;
