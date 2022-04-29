#node:18-alpine3.14
FROM ubuntu:latest AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install nodejs npm procps -y

RUN npm install -g env-cmd nest rimraf

RUN npm install

COPY . .

RUN npm run build

CMD npm start

FROM ubuntu:latest as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install nodejs npm procps -y

RUN npm install -g env-cmd nest rimraf

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
