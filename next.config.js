/** @type {import('next').NextConfig} */
const nextConfig = {
  /** output: 'export',*/
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' https://raw.githubusercontent.com; media-src https://play.pokemonshowdown.com",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;