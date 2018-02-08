FROM node:8.9.2-alpine

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
ARG REACT-ENV=''

COPY . /app/
RUN REACT_APP_ENV=$REACT-ENV yarn build

EXPOSE 1234 3000

ENTRYPOINT ["yarn"]
CMD ["start:server"]