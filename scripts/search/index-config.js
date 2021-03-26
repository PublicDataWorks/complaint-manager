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
    protocol: "https://",
    host: "a391144cd5a24f97b8cb06634ace33d3.us-east-1.aws.found.io",
    port: "9243",
    indexName: `${CI}_${INDEX_NAME}`
  },
  [STAGING]: {
    protocol: "https://",
    host: "a391144cd5a24f97b8cb06634ace33d3.us-east-1.aws.found.io",
    port: "9243",
    indexName: `${STAGING}_${INDEX_NAME}`
  },
  [PRODUCTION]: {
    protocol: "https://",
    host: "a391144cd5a24f97b8cb06634ace33d3.us-east-1.aws.found.io",
    port: "9243",
    indexName: `${PRODUCTION}_${INDEX_NAME}`
  }
};

module.exports = config;
