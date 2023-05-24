/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EnvironmentVariable, type LoggerLevel } from '@wundergraph/sdk';
import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import type { HooksConfig } from './generated/wundergraph.hooks';
import type { InternalClient } from './generated/wundergraph.internal.client';

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
  hooks: {
		authentication: {
			mutatingPostAuthentication: async ({ user }) => {
				user.roles = user.customClaims.roles;
        return {
          user: user,
          status: 'ok',
        };
      },
			postAuthentication: async ({ user, log }) => {
				// user.roles = user.customClaims.roles;
				log.info(JSON.stringify(user));
				log.info(`User ${user.userId} has been authenticated`);
			},
		},
    queries: {
			
		},
    mutations: {

		}
  },
	options: {
    listen: {
      host: new EnvironmentVariable('WG_SERVER_HOST', 'localhost'),
      port: new EnvironmentVariable('WG_SERVER_PORT', '9992'),
    },
    serverUrl: new EnvironmentVariable('WG_SERVER_URL', 'http://localhost:9992/'),
    logger: {
      level: new EnvironmentVariable<LoggerLevel>('WG_SERVER_LOG_LEVEL', 'info'),
    },
  },
}));
