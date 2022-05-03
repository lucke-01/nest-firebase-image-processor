#DEVELOPMENT
FROM node:18-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g env-cmd nest rimraf @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

#PRODUCTION
FROM node:18-alpine3.14 AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g env-cmd nest rimraf @nestjs/cli

RUN npm install

COPY . .

RUN npm run build