FROM node:8.11-alpine

RUN apk update && apk add bash

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
ARG REACT_ENV

COPY . /app/
RUN REACT_APP_ENV=$REACT_ENV yarn build

EXPOSE 1234 3000

CMD ["yarn", "start:server"]