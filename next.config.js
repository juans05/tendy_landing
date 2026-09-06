/** @type {import('next').NextConfig} */
const storage = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null;
const nextConfig = {
  images: {
    remotePatterns: storage ? [{ protocol: storage.protocol.slice(0, -1), hostname: storage.hostname, port: storage.port, pathname: '/storage/v1/object/public/catalog/**' }] : [],
  },
};
module.exports = nextConfig;
