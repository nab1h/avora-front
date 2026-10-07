import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

export default withNextIntl(nextConfig);