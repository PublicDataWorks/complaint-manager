"use strict";

const INDEX_NAME = "cases";

const DEVELOPMENT = "development";
const TEST = "test";
const CI = "ci";
const STAGING = "staging";
const PRODUCTION = "production";

const config = {
  [DEVELOPMENT]: {
    protocol: "http://",
    host: "elasticsearch",
    port: "9200",
    indexName: `${DEVELOPMENT}_${INDEX_NAME}`
  },
  [TEST]: {
    protocol: "http://",
    host: "elasticsearch",
    port: "9200",
    indexName: `${TEST}_${INDEX_NAME}`
  },
  [CI]: {
    id: "noipm-deployment:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbzo0NDMkYTM5MTE0NGNkNWEyNGY5N2I4Y2IwNjYzNGFjZTMzZDMk",
    indexName: `${CI}_${INDEX_NAME}`
  },
  [STAGING]: {
    id: "noipm-deployment:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbzo0NDMkYTM5MTE0NGNkNWEyNGY5N2I4Y2IwNjYzNGFjZTMzZDMk",
    indexName: `${STAGING}_${INDEX_NAME}`
  },
  [PRODUCTION]: {
    id: "oipm-deployment:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjMTIyMzIzYzc2ZDY0MDcxODQ5Y2ZiYWRjMmExZDU3MCQ1ZDJhMjllYzQwNjg0NTIxODk0Y2Y0MDZiOTFjZWQ4MA==",
    indexName: `${PRODUCTION}_${INDEX_NAME}`
  }
};

module.exports = config;
