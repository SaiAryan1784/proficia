/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
      'platform-lookaside.fbsbx.com', // Facebook profile images
      'pbs.twimg.com',  // Twitter profile images
      'cdn.discordapp.com', // Discord profile images
      'via.placeholder.com', // Placeholder images for testing
    ],
  },
};

module.exports = nextConfig; 