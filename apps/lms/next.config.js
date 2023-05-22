/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
  experimental: {
    appDir: true,
		serverActions: true,
  },

	/** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@o4s/generated-wundergraph", "@o4s/auth", "@o4s/db", "@o4s/comm"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },

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
