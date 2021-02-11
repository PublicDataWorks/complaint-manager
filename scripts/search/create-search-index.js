'use strict';

(async () => {
  const environment = process.env.NODE_ENV || 'development';
  const { host, port, indexName: index } = require('./index-config')[environment];

  const elasticSearch = require('@elastic/elasticsearch');
  const elasticClient = new elasticSearch.Client({ node: `${host}${port ? ':' + port : ''}` });

  process.on('uncaughtException', error => {
    console.error(error);
    return 1;
  });
  
  console.log(`Checking for ${index} index...`);
  const { body: isIndexThere } = await elasticClient.indices.exists({ index });

  if (isIndexThere) {
    console.log('Deleting previous version of index...');
    await elasticClient.indices.delete({ index });
  }
  
  console.log(`Creating ${index} index...`);
  await elasticClient.indices.create({
    index,
    body: {
      mappings: {
        properties: {
          tag_name: { type: 'text' },
          case_id: { type: 'integer' }
        }
      }
    }
  },  { ignore: [400] });
  
  console.log(`Index ${index} created.`);
  
  const models = require("../../src/server/policeDataManager/models/index");
  const tagsResult = await models.case_tag.findAll({
    include: [{
      model: models.tag,
      as: 'tag'
    }]
  });

  if (!tagsResult) {
    console.error('Something went wrong while fetching tags.');
    return 1;
  }
  
  if (!tagsResult.length) {
    console.log('No tags were found. Ending script.');
    return 0;
  }
    
  const bulkOperations = tagsResult.flatMap(tagResult => {
    const operation = { index: { _index: index } };

    const { caseId: case_id } = tagResult.dataValues;
    const { name: tag_name } = tagResult.tag.dataValues;
    const document = { case_id, tag_name };
    
    return [operation, document];
  });

  await elasticClient.bulk({ refresh: true, body: bulkOperations });

  const { body: { count: count } } = await elasticClient.count({ index });

  console.log(`${count} records indexed.`);

  return 0;
})();
