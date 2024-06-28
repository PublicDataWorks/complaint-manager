import { buildQueryString } from "../../sharedUtilities/search/searchUtilities";

export const getResultsFromES = async queryString => {
  const MAX_ELASTICSEARCH_HIT_SIZE = 10000;
  const environment = process.env.NODE_ENV || "development";
  const { indexName: index } =
    require("../../sharedUtilities/search/search-index-config")[environment];

  let elasticClient;
  try {
    elasticClient =
      require("../../sharedUtilities/search/create-configured-search-client")();
  } catch (err) {
    handleError(err);
  }

  console.log("searching in ", index);
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
