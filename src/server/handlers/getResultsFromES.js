import { DEFAULT_PAGINATION_LIMIT } from "../../sharedUtilities/constants";

export const getResultsFromES = async (queryString, currentPage = 1) => {
  const environment = process.env.NODE_ENV || "development";
  const {
    protocol,
    host,
    port,
    indexName: index
  } = require("../../../scripts/search/index-config")[environment];
  const size = DEFAULT_PAGINATION_LIMIT;

  const username = process.env.ELASTIC_USERNAME || null;
  const password = process.env.ELASTIC_PASSWORD || null;

  const elasticSearch = require("@elastic/elasticsearch");
  const elasticClient = new elasticSearch.Client({
    node: `${protocol}${host}${port ? ':' + port : ''}`,
    auth: { username, password },
    ssl: {
      rejectUnauthorized: false
    }
  });

  const { body: searchResults } = await elasticClient
    .search({
      index,
      from: (currentPage - 1) * size,
      size,
      body: {
        query: {
          query_string: {
            query: `*${queryString}*`
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

  return [
    Array.isArray(hits) ? hits.map(hit => hit._source) : [],
    searchResults.hits.total.value
  ];
};
