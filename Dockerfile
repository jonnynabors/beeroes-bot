FROM node:current-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
COPY . .
RUN ls
RUN yarn build
EXPOSE 8080
CMD ["node", "build/src/index.js"]