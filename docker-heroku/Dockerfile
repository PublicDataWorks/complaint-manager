FROM docker:stable

ENV HEROKU_CLI_VERSION '7.0.65'
RUN apk add --update nodejs nodejs-npm
RUN npm install -g heroku@$HEROKU_CLI_VERSION

RUN heroku --version