# Use a imagem oficial do Node.js como base
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos do projeto para o diretório de trabalho
COPY . .

# Instale as dependências
RUN npm install --omit=dev

# Compile o projeto TypeScript
RUN npm run build

# Exponha a porta em que o servidor MCP será executado
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "dist/index.js"]
