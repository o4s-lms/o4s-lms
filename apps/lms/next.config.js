/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
		serverActions: true,
  },
  images: {
    domains: [
			"joseantcordeiro.hopto.org",
			"joseantcordeiro.hopto.org:9000",
			"vercel.com",
			"s.gravatar.com"
		],
  },
}

module.exports = nextConfig
