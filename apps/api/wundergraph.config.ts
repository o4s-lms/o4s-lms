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

const aws = {
  name: 'minio', // a unique name for the storage provider
  endpoint: new EnvironmentVariable('MINIO_URL', 'localhost:9000'), // the MinIO endpoint
  accessKeyID: new EnvironmentVariable('MINIO_ROOT_USER', 'minioadmin'), // access key to upload files to the S3 bucket
  secretAccessKey: new EnvironmentVariable('MINIO_ROOT_PASSWORD', 'minioadmin'), // access secret to upload files to the S3 bucket
  bucketName: 'uploads', // the bucket name to which you're uploading files
	bucketLocation: 'eu-central-1',
  useSSL: false, // disable SSL if you're running e.g. Minio on your local machine
  uploadProfiles: {
    images: {
      requireAuthentication: true, // optional, defaults to true
      maxAllowedUploadSizeBytes: 1024 * 1024 * 1, // 10 MB, optional, defaults to 25 MB
      maxAllowedFiles: 1, // limit the number of files to 1, leave undefined for unlimited files
      allowedMimeTypes: ['image/png', 'image/jpeg'], // wildcard is supported, e.g. 'image/*', leave empty/undefined to allow all
      allowedFileExtensions: ['png', 'jpg'], // leave empty/undefined to allow all
    },
  },
};

const countries = introspect.graphql({
  apiNamespace: 'countries',
  url: 'https://countries.trevorblades.com/'
});

const lms = introspect.prisma({
  apiNamespace: 'lms',
  prismaFilePath: './prisma/schema.prisma',
});

/**const lms = introspect.postgresql({
  apiNamespace: 'lms',
  databaseURL: new EnvironmentVariable('DATABASE_URL', 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE'),
});*/

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	s3UploadProvider: [aws],
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
		/** customClaims: {
			// Implicit: required
			SHOPID: {
				jsonPath: 'shop.id', // Nested 'id' field inside a 'shop' object
				type: 'int', // Must be an integer
			},
			// Implicit: string
			TENANTID: {
				jsonPath: 'teid',
				required: false, // Optional
			},
		}, */
    tokenBased: {
      providers: [
        {
          userInfoEndpoint: new EnvironmentVariable('WG_TOKEN_AUTH_ENDPOINT', 'http://localhost:3000/api/auth/session'),
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
	experimental: {
		orm: true,
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
