FROM node:26-alpine AS base

ENV HUSKY=0

RUN apk upgrade --no-cache && apk add --no-cache curl make

RUN npm install -g pnpm@12.9.1

RUN mkdir -p /app/packages && chown node:node /app /app/packages
USER node

ADD --chown=node:node makefile /app/
ADD --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
ADD --chown=node:node packages/admin/package.json /app/packages/admin/

WORKDIR /app/packages/admin

RUN pnpm -F "@linkx-integration/admin..." install --frozen-lockfile

ADD --chown=node:node tsconfig.base.json /app/

FROM base AS dev

WORKDIR /app/packages/admin

CMD ["pnpm", "run", "dev"]
