FROM node:carbon-alpine

COPY . /tmp/
WORKDIR /tmp/
EXPOSE 1234
ENTRYPOINT ["yarn"]
CMD ["start:server"]
