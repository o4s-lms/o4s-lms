//import MillionLint from '@million/lint';
import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

import redirects from './redirects.js';
import { withSentryConfig } from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
        port: '',
        pathname: '**',
        search: '',
      },
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item);
        const protocol = url.protocol.replace(':', '') as 'http' | 'https';

        return {
          hostname: url.hostname,
          protocol,
        };
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
};

const noWrapper = (config: NextConfig) => config;

const hasSentry = !!process.env.SENTRY_DSN;
const withSentry =
  //isProd && hasSentry
  hasSentry
    ? (c: NextConfig) =>
        withSentryConfig(
          c,
          {
            org: process.env.SENTRY_ORG,

            project: process.env.SENTRY_PROJECT,
            // For all available options, see:
            // https://github.com/getsentry/sentry-webpack-plugin#options
            // Suppresses source map uploading logs during build
            silent: false,
          },
        )
    : noWrapper;

export default withPayload(withSentry(nextConfig) as NextConfig);

//export default MillionLint.next({ enabled: true, rsc: true })(withPayload(nextConfig));
