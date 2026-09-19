# Build Process
FROM node:20.9.0-alpine AS build

WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runtime Process
FROM nginx:1.25.5-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/dist .
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]