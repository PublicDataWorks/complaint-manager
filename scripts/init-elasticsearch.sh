#!/bin/bash
echo "Waiting for ElasticSearch to become available..."
./wait-for-it.sh elasticsearch:9200

# Creates the index
npx babel-node ./scripts/search/create-search-index.js
