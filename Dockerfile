# Imagem base do Node.js
FROM node:latest

# Diretório de trabalho do aplicativo
WORKDIR /app

# Copiar os arquivos de aplicativo para o diretório de trabalho
COPY package.json package-lock.json /app/
COPY client.js /app/

# Instalar as dependências do aplicativo
RUN npm install

# Comando para iniciar o cliente
CMD [ "node", "client.js" ]
