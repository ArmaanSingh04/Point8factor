FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN npm install -g pnpm
COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

RUN pnpm install

RUN pnpm build

EXPOSE 8000
CMD ["pnpm" , "start:websocket"]