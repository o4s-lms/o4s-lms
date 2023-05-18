# Image layer for building the application
FROM node:18-alpine as build

# global npm dependencies: recommended to place those dependencies in the non-root user directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g pnpm turbo

WORKDIR /usr/src/app

COPY . .

# install dependencies
RUN pnpm install
RUN pnpm install --offline

# generate your wundergraph application
RUN pnpm turbo run build --filter=api...

# Image layer for production
FROM node:18-alpine as runner
WORKDIR /usr/src/app

# copy entire project and dependencies
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/apps/api ./

# copy wunderctl
COPY --from=build --chown=node:node /usr/src/app/node_modules/@wundergraph/wunderctl/download/wunderctl /usr/local/bin/wunderctl

RUN wunderctl version

# run as non-root user
USER node

CMD WG_NODE_HOST=0.0.0.0 wunderctl start

EXPOSE 9991