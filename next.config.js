/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    NEXTAUTH_SECRET: 'my-secret-key-for-development',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
}

module.exports = nextConfig