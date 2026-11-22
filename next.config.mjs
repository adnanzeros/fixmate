// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ImgBB (i.ibb.co), Google avatars and any seed image host
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
