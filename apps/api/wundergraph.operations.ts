import { configureWunderGraphOperations } from '@wundergraph/sdk';
import type { OperationsConfiguration } from './generated/wundergraph.operations';

export default configureWunderGraphOperations<OperationsConfiguration>({
  operations: {
    defaultConfig: {
      authentication: {
        required: true
      }
    },
    queries: (config) => ({
      ...config,
      caching: {
        enable: false,
        staleWhileRevalidate: 60,
        maxAge: 60,
        public: true
      },
      liveQuery: {
        enable: true,
        pollingIntervalSeconds: 1
      },
    }),
    mutations: (config) => ({
      ...config
    }),
    subscriptions: (config) => ({
      ...config
    }),
    custom: {
			HealthLive: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			SiteGet_faqs: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			SiteGet_testimonials: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			SiteGet_products: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			BlogPosts: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			BlogTags: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			BlogPost_slug: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			UsersCreate: (config) => ({
				...config,
				authentication: {
					required: false,
				},
			}),
			
		},
  }
});
