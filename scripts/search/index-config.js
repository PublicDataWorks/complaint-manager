'use strict';

const INDEX_NAME = 'cases';

const DEVELOPMENT = 'development';
const TEST = 'test';
const CI = 'ci';
const STAGING = 'staging';
const PRODUCTION = 'production';

const config = {
  [DEVELOPMENT]: {
    host: 'http://elasticsearch',
    port: '9200',
    indexName: `${DEVELOPMENT}_${INDEX_NAME}`
  },
  [TEST]: {
    host: 'http://localhost',
    port: '9200',
    indexName: `${TEST}_${INDEX_NAME}`
  },
  [CI]: {
    host: 'http://localhost',
    port: '9200',
    indexName: `${CI}_${INDEX_NAME}`
  },
  [STAGING]: {
    host: 'http://localhost',
    port: '9200',
    indexName: `${STAGING}_${INDEX_NAME}`
  },
  [PRODUCTION]: {
    host: 'http://localhost',
    port: '9200',
    indexName: `${PRODUCTION}_${INDEX_NAME}`
  }
};

module.exports = config;
