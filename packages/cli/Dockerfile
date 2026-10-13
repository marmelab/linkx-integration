FROM node:26-alpine AS base

ENV HUSKY=0

RUN apk upgrade --no-cache && apk add --no-cache curl make

RUN npm install -g pnpm

RUN mkdir -p /app/packages && chown node:node /app /app/packages
USER node

ADD --chown=node:node makefile /app/
ADD --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
ADD --chown=node:node packages/cli/package.json /app/packages/cli/

WORKDIR /app/packages/cli

RUN pnpm -F "@linkx-integration/cli..." install --frozen-lockfile

ADD --chown=node:node tsconfig.base.json /app/
ADD --chown=node:node packages/cli /app/packages/cli

FROM base AS server

ENV PORT=3000

WORKDIR /app/

CMD ["pnpm", "--filter", "@linkx-integration/cli", "run", "run:server"]