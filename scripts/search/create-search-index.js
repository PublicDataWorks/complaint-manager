"use strict";

(async () => {
  const environment = process.env.NODE_ENV || "development";
  const { protocol, host, port, indexName: index } = require("./index-config")[
    environment
  ];
  const username = process.env.ELASTIC_USERNAME;
  const password = process.env.ELASTIC_PASSWORD;

  const elasticSearch = require("@elastic/elasticsearch");
  const elasticClient = new elasticSearch.Client({
    node: `${protocol}${
      username ? username + ":" + password + "@" : ""
    }${host}${port ? ":" + port : ""}`
  });

  process.on("uncaughtException", error => {
    console.error(typeof error);
    console.error(error);
    return 1;
  });

  function handleError(err) {
    console.error("Caught Error: ", err);
    process.exit(1);
  }

  console.log(`Checking for ${index} index...`);
  const { body: isIndexThere } = await elasticClient.indices
    .exists({ index })
    .catch(handleError);

  if (isIndexThere) {
    console.log("Deleting previous version of index...");
    await elasticClient.indices.delete({ index }).catch(handleError);
  }

  console.log(`Creating ${index} index...`);
  await elasticClient.indices
    .create(
      {
        index,
        body: {
          mappings: {
            properties: {
              tag_name: { type: "text" },
              case_id: { type: "integer" }
            }
          }
        }
      },
      { ignore: [400] }
    )
    .catch(handleError);

  console.log(`Index ${index} created.`);

  const models = require("../../src/server/policeDataManager/models/index");
  const tagsResult = await models.case_tag.findAll({
    include: [
      {
        model: models.tag,
        as: "tag"
      }
    ]
  });

  if (!tagsResult) {
    console.error("Something went wrong while fetching tags.");
    return 1;
  }

  if (!tagsResult.length) {
    console.log("No tags were found. Ending script.");
    return 0;
  }

  const bulkOperations = tagsResult.flatMap(tagResult => {
    const operation = { index: { _index: index } };

    const { caseId: case_id } = tagResult.dataValues;
    const { name: tag_name } = tagResult.tag.dataValues;
    const document = { case_id, tag_name };

    return [operation, document];
  });

  await elasticClient
    .bulk({ refresh: true, body: bulkOperations })
    .catch(handleError);

  const {
    body: { count: count }
  } = await elasticClient.count({ index }).catch(handleError);

  console.log(`${count} records indexed.`);

  return 0;
})();
