FROM node:alpine

WORKDIR /react

COPY package.json .

RUN yarn install

COPY . .

CMD yarn start

EXPOSE 3000