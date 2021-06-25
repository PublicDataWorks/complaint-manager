"use strict";

import { ACCUSED, COMPLAINANT } from "../../src/sharedUtilities/constants";

const updateSearchIndex = async () => {
  const environment = process.env.NODE_ENV || "development";
  const {
    protocol,
    host,
    port,
    indexName: index
  } = require("./index-config")[environment];

  const username = process.env.ELASTIC_USERNAME || null;
  const password = process.env.ELASTIC_PASSWORD || null;

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
              first_name: { type: "text" },
              last_name: { type: "text" },
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

  const tagsResults = await models.case_tag.findAll({
    include: [
      {
        model: models.tag,
        as: "tag"
      }
    ]
  });
  const caseOfficersResults = await models.case_officer.findAll({
    where: {
      roleOnCase: { [models.Sequelize.Op.or]: [COMPLAINANT, ACCUSED] }
    }
  });
  const civiliansResults = await models.civilian.findAll({
    where: { roleOnCase: COMPLAINANT }
  });

  if (
    !tagsResults.length &&
    !caseOfficersResults.length &&
    !civiliansResults.length
  ) {
    console.log("No results were found. Ending script.");
    return 0;
  }

  const operation = { index: { _index: index } };

  const caseOfficerBulkOperations = caseOfficersResults.flatMap(
    caseOfficersResult => {
      const {
        caseId: case_id,
        firstName: first_name,
        lastName: last_name
      } = caseOfficersResult.dataValues;
      const document = { case_id, first_name, last_name };

      return [operation, document];
    }
  );

  const civilianBulkOperations = civiliansResults.flatMap(civiliansResult => {
    const {
      caseId: case_id,
      firstName: first_name,
      lastName: last_name
    } = civiliansResult.dataValues;
    const document = { case_id, first_name, last_name };

    return [operation, document];
  });

  const tagBulkOperations = tagsResults.flatMap(tagsResult => {
    const { caseId: case_id } = tagsResult.dataValues;
    const { name: tag_name } = tagsResult.tag.dataValues;
    const document = { case_id, tag_name };

    return [operation, document];
  });

  const bulkOperations = tagBulkOperations.concat(
    caseOfficerBulkOperations,
    civilianBulkOperations
  );

  console.log(bulkOperations);

  await elasticClient
    .bulk({ refresh: true, body: bulkOperations })
    .catch(handleError);

  const {
    body: { count: count }
  } = await elasticClient.count({ index }).catch(handleError);

  console.log(`${count} records indexed.`);

  return 0;
};

updateSearchIndex().catch(error => {
  console.error(error);
  process.exit(1);
});
