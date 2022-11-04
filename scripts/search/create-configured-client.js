const environment = process.env.NODE_ENV || "development";
const {
  id,
  protocol,
  host,
  port,
  indexName: index
} = require("./index-config")[environment];

const username = process.env.ELASTIC_USERNAME;
const password = process.env.ELASTIC_PASSWORD;

const createConfiguredElasticSearchClient = () => {
  const elasticSearch = require("@elastic/elasticsearch");
  console.log(`Connecting to Elastic search in ${environment} env`);
  let elasticClient;
  if (id) {
    elasticClient = new elasticSearch.Client({
      cloud: { id },
      auth: { username, password }
    });
  } else if (protocol && host && port) {
    elasticClient = new elasticSearch.Client({
      node: `${protocol}${
        username ? username + ":" + password + "@" : ""
      }${host}${port ? ":" + port : ""}`
    });
  } else {
    throw new Error(
      "elastic environment setup is insufficient, check scripts/search/index-config.js"
    );
  }

  return elasticClient;
};

module.exports = createConfiguredElasticSearchClient;
