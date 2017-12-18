FROM node:8.9.2-alpine

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile

COPY . /app/
RUN yarn build

EXPOSE 1234 3000

ENTRYPOINT ["yarn"]
CMD ["setup:db", "start:server"]