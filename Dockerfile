FROM node:20

# Instala o cliente MySQL e outras dependências
RUN apt-get update && apt-get install -y default-mysql-client netcat-openbsd

# Cria o diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependências e instala
COPY package*.json ./
RUN npm install
RUN npm install --save class-validator class-transformer

# Copia o restante do projeto
COPY . .

# Dá permissão de execução ao script de entrypoint
RUN chmod +x ./entrypoint.sh

# Copia o arquivo .env (se necessário para o container)
COPY .env .env

# Compila a aplicação
RUN npm run build

# Executa o script de entrada
CMD ["./entrypoint.sh"]