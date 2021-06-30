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

  const results = await models.cases.findAll({
    include: [
      {
        model: models.case_tag,
        as: "caseTags",
        include: [
          {
            model: models.tag,
            as: "tag"
          }
        ]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.case_officer,
        as: "accusedOfficers"
      },
      {
        model: models.civilian,
        as: "complainantCivilians"
      }
    ]
  });

  if (!results.length) {
    console.log("No results were found. Ending script.");
    return 0;
  }

  const operation = { index: { _index: index } };
  const mapPerson = person => ({
    first_name: person.firstName,
    last_name: person.lastName
  });

  const bulkOperations = results.flatMap(result => {
    let case_id = result.id;
    let tags = result.caseTags.map(tag => tag.tag.name);
    let complainantOfficers = result.complainantOfficers.map(mapPerson);
    let accusedOfficers = result.accusedOfficers.map(mapPerson);
    let civilians = result.complainantCivilians.map(mapPerson);
    const document = {
      case_id,
      tags,
      accusedOfficers,
      complainantOfficers,
      civilians
    };

    return [operation, document];
  });

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
