import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  type LoggerLevel,
  templates
} from '@wundergraph/sdk';
import { NextJsTemplate } from '@wundergraph/nextjs/dist/template';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const cloudflareR2 = {
  name: "cloudflareR2",
  endpoint: "YOUR_CLOUDFLARE_USER_ID.r2.cloudflarestorage.com",
  accessKeyID: "YOUR_ACCESS_KEY_ID",
  secretAccessKey:
    "YOUR_SECRET_ACCESS_KEY",
  bucketLocation: "", // not all S3 providers require this
  bucketName: "YOUR_BUCKET_NAME",
  useSSL: true, // you'll always want SSL enabled for cloud storage
  uploadProfiles: {
    // profile for a user's 'avatar' picture 
    avatar: {
      maxAllowedUploadSizeBytes: 1024 * 1024 * 10, // 10 MB, optional, defaults to 25 MB
      maxAllowedFiles: 1, // limit the number of files to 1, leave undefined for unlimited files
      allowedMimeTypes: ["image/png", "image/jpeg"], // wildcard is supported, e.g. 'image/*', leave empty/undefined to allow all
      allowedFileExtensions: ["png", "jpg"], // leave empty/undefined to allow all}z
      requireAuthentication: true, // WunderGraph only lets authenticated users upload files but for this demonstration, use this to override it
    },
		lessons: {
			maxAllowedUploadSizeBytes: 1024 * 1024 * 10, // 10 MB, optional, defaults to 25 MB
      maxAllowedFiles: 1, // limit the number of files to 1, leave undefined for unlimited files
      allowedMimeTypes: ["image/png", "image/jpeg"], // wildcard is supported, e.g. 'image/*', leave empty/undefined to allow all
      allowedFileExtensions: ["png", "jpg"], // leave empty/undefined to allow all}z
      requireAuthentication: true, // WunderGraph only lets authenticated users upload files but for this demonstration, use this to override it
		},
  },
};

const countries = introspect.graphql({
  apiNamespace: 'countries',
  url: 'https://countries.trevorblades.com/'
});

const lms = introspect.postgresql({
  apiNamespace: 'lms',
  databaseURL: new EnvironmentVariable('WG_DATABASE_URL', 'localhost'),
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [countries, lms],
  server,
	operations,
  codeGenerators: [
    {
      templates: [
        // use all the typescript react templates to generate a client
        ...templates.typescript.all,
        templates.typescript.operations,
        templates.typescript.linkBuilder
      ]
    },
    {
      templates: [templates.typescript.client],
      path: '../../packages/generated-wundergraph'
    },
		{
			templates: [new NextJsTemplate()],
			path: '../../packages/generated-wundergraph',
		},
  ],
	authentication: {
    tokenBased: {
      providers: [
        {
          userInfoEndpoint: 'http://joseantcordeiro.hopto.org:4000/api/auth/userInfo',
        },
      ],
    },
	},
	authorization: {
    roles: ['admin', 'user'],
  },
  cors: {
    ...cors.allowAll,
		/**allowedOrigins: process.env.NODE_ENV === 'production' ? ['https://*'] : ['http://*'],
		
		 * Please configure CORS carefully to make sure that your users are protected.
		 * Allowing all origins is usually the worst possible configuration.
		 *
		 * @docs https://docs.wundergraph.com/docs/wundergraph-config-ts-reference/configure-cors
		 */
		// allowedOrigins: process.env.NODE_ENV === 'production' ? ['http://your.app'] : ['http://localhost:3000'],
    /**allowedOrigins:
      process.env.NODE_ENV === 'production'
        ? [
            // change this before deploying to production to the actual domain where you're deploying your app
            'http://localhost:3000'
          ]
        : [
            'http://localhost:3000',
            'http://127.0.0.1:3000/',
            new EnvironmentVariable('WG_ALLOWED_ORIGIN')
          ]*/
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false
  },
  security: {
    enableGraphQLEndpoint:
      process.env.NODE_ENV !== 'production'
  },
	openApi: {
    title: 'O4S LMS',
    apiVersion: '0.1.0',
  },
	options: {
    listen: {
      host: new EnvironmentVariable('WG_NODE_HOST', 'localhost'),
      port: new EnvironmentVariable('WG_NODE_PORT', '9991'),
    },
    listenInternal: {
      port: new EnvironmentVariable('WG_NODE_INTERNAL_PORT', '9993'),
    },
    nodeUrl: new EnvironmentVariable('WG_NODE_URL', 'http://localhost:9991/'),
    publicNodeUrl: new EnvironmentVariable('WG_PUBLIC_NODE_URL', 'http://localhost:9991/'),
    logger: {
      level: new EnvironmentVariable<LoggerLevel>('WG_NODE_LOG_LEVEL', 'info'),
    },
  },
});
