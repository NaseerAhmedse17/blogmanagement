# Use when Railway "Root Directory" is set to `backend`.
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
CMD ["node", "server.js"]
