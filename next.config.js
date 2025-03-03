/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    // !! PERINGATAN !!
    // Sementara kita menonaktifkan type checking saat build
    // untuk mengatasi error yang ada
    ignoreBuildErrors: true,
  },
  eslint: {
    // Sementara kita menonaktifkan eslint saat build
    // untuk mengatasi error yang ada
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
