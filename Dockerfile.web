FROM node:8.11-alpine

RUN apk update && apk add bash

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
ARG REACT_ENV
ARG REACT_APP_GOOGLE_API_KEY

COPY . /app/
RUN REACT_APP_ENV=$REACT_ENV REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY yarn build

EXPOSE 1234 3000

CMD ["yarn", "start:server"]