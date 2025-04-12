FROM node:20

RUN apt-get update && apt-get install -y default-mysql-client netcat-openbsd

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install --save class-validator class-transformer

COPY . .

RUN chmod +x ./entrypoint.sh

COPY .env .env

RUN npm run build

CMD ["./entrypoint.sh"]