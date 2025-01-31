//import MillionLint from '@million/lint';
import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

import redirects from './redirects.js';

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

export default withPayload(nextConfig);

//export default MillionLint.next({ enabled: true, rsc: true })(withPayload(nextConfig));
