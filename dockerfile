#node:18-alpine3.14
FROM ubuntu:latest AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install nodejs npm procps -y

RUN npm install -g env-cmd nest rimraf @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

#CMD npm start

FROM node:18-alpine3.14 AS production

WORKDIR /usr/src/app

COPY package*.json ./

#RUN apt-get update && apt-get install nodejs npm procps -y

RUN npm install -g env-cmd nest rimraf @nestjs/cli

RUN npm install

COPY . .

RUN npm run build