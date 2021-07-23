import { buildQueryString } from "../../sharedUtilities/searchUtilities";

export const getResultsFromES = async queryString => {
  const environment = process.env.NODE_ENV || "development";
  const {
    protocol,
    host,
    port,
    indexName: index
  } = require("../../../scripts/search/index-config")[environment];

  const username = process.env.ELASTIC_USERNAME || null;
  const password = process.env.ELASTIC_PASSWORD || null;

  const MAX_ELASTICSEARCH_HIT_SIZE = 10000;

  const elasticSearch = require("@elastic/elasticsearch");
  const elasticClient =
    username && password
      ? new elasticSearch.Client({
          node: `${protocol}${host}${port ? ":" + port : ""}`,
          auth: { username, password },
          ssl: {
            rejectUnauthorized: false
          }
        })
      : new elasticSearch.Client({
          node: `${protocol}${
            username ? username + ":" + password + "@" : ""
          }${host}${port ? ":" + port : ""}`
        });

  const { body: searchResults } = await elasticClient
    .search({
      index,
      size: MAX_ELASTICSEARCH_HIT_SIZE,
      body: {
        query: {
          query_string: {
            query: buildQueryString(queryString),
            default_operator: "and"
          }
        }
      }
    })
    .catch(err => {
      console.error("Caught Error: ", err);
      throw new Error(err);
    });

  const { get } = require("lodash");
  const { hits } = get(searchResults, ["hits"], {});

  return Array.isArray(hits) ? hits.map(hit => hit._source) : [];
};
