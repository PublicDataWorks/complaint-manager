"use strict";

const {
  buildQueryString
} = require("../../src/sharedUtilities/searchUtilities");

const util = require("util");

(async () => {
  const environment = process.env.NODE_ENV || "development";
  const {
    protocol,
    host,
    port,
    indexName: index
  } = require("./index-config")[environment];

  const username = process.env.ELASTIC_USERNAME;
  const password = process.env.ELASTIC_PASSWORD;

  const elasticSearch = require("@elastic/elasticsearch");
  console.log(`Connecting to Elastic search in ${environment} env`);
  const elasticClient = new elasticSearch.Client({
    node: `${protocol}${
      username ? username + ":" + password + "@" : ""
    }${host}${port ? ":" + port : ""}`
  });

  function handleError(err) {
    console.error("Caught Error: ", err);
    process.exit(1);
  }

  const query = buildQueryString(process.argv.slice(2).join(" "));

  console.log(`Searching for '${query}'...`);

  const { body: searchResults } = await elasticClient
    .search({
      index,
      size: 100,
      body: {
        query: {
          query_string: {
            query,
            default_operator: "and"
          }
        }
      }
    })
    .catch(handleError);

  const { get, chunk } = require("lodash");
  const { hits } = get(searchResults, ["hits"], {});
  console.log(`Found ${hits.length} results.`);

  const logPage = (page, pageIdx) => {
    page.forEach((row, idx) => {
      console.group(`${pageIdx}.${idx}`);
      Object.keys(row).forEach(key => {
        if (Array.isArray(row[key])) {
          console.group(key);
          row[key].forEach(item => {
            console.log(item);
          });
          console.groupEnd();
        } else if (typeof row[key] === "object") {
          console.log(key, util.inspect(row[key], { depth: null }));
        } else {
          console.log(key, row[key]);
        }
      });
      console.groupEnd();
    });
  };

  if (Array.isArray(hits) && hits.length) {
    chunk(
      hits.map(hit => hit._source),
      10
    ).forEach(logPage);
  }

  return 0;
})();
