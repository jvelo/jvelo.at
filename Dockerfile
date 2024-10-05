# Use Node.js 20 as the base image
FROM node:20-slim as base

# Set for base and all layers that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

RUN apt-get update && apt-get install -y build-essential python3

WORKDIR /jvelo

ADD package.json yarn.lock ./
RUN yarn install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /jvelo

COPY --from=deps /jvelo/node_modules /jvelo/node_modules
ADD package.json yarn.lock ./
RUN yarn install --production

# Build the app
FROM base as build

WORKDIR /jvelo

COPY --from=deps /jvelo/node_modules /jvelo/node_modules

ADD . .
RUN yarn run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV="production"

WORKDIR /jvelo

COPY --from=production-deps /jvelo/node_modules /jvelo/node_modules

COPY --from=build /jvelo/.next /jvelo/.next
COPY --from=build /jvelo/public /jvelo/public
COPY --from=build /jvelo/package.json /jvelo/package.json

ENTRYPOINT [ "yarn", "start" ]