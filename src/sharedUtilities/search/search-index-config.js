const INDEX_NAME = "cases";

const DEVELOPMENT = "development";
const TEST = "test";
const CI = "ci";
const STAGING = "staging";
const PRODUCTION = "production";

const serverConfig = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

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
    id: serverConfig[CI].elasticIndexId,
    indexName: `${CI}_${INDEX_NAME}`
  },
  [STAGING]: {
    id: serverConfig[STAGING].elasticIndexId,
    indexName: `${STAGING}_${INDEX_NAME}`
  },
  [PRODUCTION]: {
    id: serverConfig[PRODUCTION].elasticIndexId,
    indexName: `${PRODUCTION}_${INDEX_NAME}`
  }
};

module.exports = config;
