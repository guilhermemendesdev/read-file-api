# Etapa de build
FROM node:18 AS build

RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node

WORKDIR /home/node/dist
COPY --chown=node:node package.json ./

# Limpar o cache e instalar as dependências
RUN npm cache clean --force
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY --chown=node:node . .

# Executar scripts de pré-build e build
RUN npm run prebuild && npm run build

# Listar arquivos em dist para depuração
RUN ls -la dist

# Expor a porta que sua aplicação irá usar
EXPOSE 6000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
