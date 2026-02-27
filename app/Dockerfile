FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch --prod
RUN pnpm install --prod --offline --frozen-lockfile

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

USER node

COPY --chown=node:node . .
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "index.js"]
