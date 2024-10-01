# Etapa de build
FROM node:16 AS build

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

WORKDIR /home/node/api
COPY --chown=node:node package.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run prebuild && npm run build && ls -la dist

# Expor a porta que sua aplicação irá usar
EXPOSE 6000

# Comando para iniciar a aplicação
CMD ["node", "dist/src/server.js"]

