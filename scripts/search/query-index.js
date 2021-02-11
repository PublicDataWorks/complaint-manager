'use strict';

(async () => {
  const environment = process.env.NODE_ENV || 'development';
  const { host, port, indexName: index } = require('./index-config')[environment];

  const elasticSearch = require('@elastic/elasticsearch');
  const elasticClient = new elasticSearch.Client({ node: `${host}${port ? ':' + port : ''}` });

  const [
    /* Process Name */,
    /* File Name */,
    query
  ] = process.argv;

  console.log(`Searching for '${query}'...`);
  
  const { body: searchResults } = await elasticClient.search({
    index,
    size: 100,
    body: {
      query: {
        query_string: {
          query: `*${query}*`
        }
      }
    }
  });

  const { get, chunk } = require('lodash');
  const { hits } = get(searchResults, ['hits'], {});
  console.log(`Found ${hits.length} results.`);
  
  if (Array.isArray(hits) && hits.length) {
    chunk(hits.map(hit => hit._source), 10).forEach(page => console.table(page));
  }

  return 0;
})();
