import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        unoptimized: true,

        remotePatterns: [
            {
                protocol: 'http',
                hostname: '**',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
