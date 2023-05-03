"use strict";

import {
  parseSearchTerm,
  removeTags
} from "../../src/sharedUtilities/searchUtilities";

const updateSearchIndex = async () => {
  const environment = process.env.NODE_ENV || "development";
  const { indexName: index } = require("./index-config")[environment];

  let elasticClient;
  try {
    elasticClient = require("./create-configured-client")();
  } catch (err) {
    handleError(err);
  }

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
              case_id: { type: "integer" },
              tag: {
                type: "nested",
                properties: {
                  name: { type: "text" }
                }
              },
              accused: {
                type: "nested",
                properties: {
                  full_name: { type: "text" },
                  full_name_with_initial: { type: "text" }
                },
                complainant: {
                  type: "nested",
                  properties: {
                    full_name: { type: "text" },
                    full_name_with_initial: { type: "text" }
                  }
                },
                narrative: {
                  type: "nested",
                  properties: {
                    summary: { type: "text" },
                    details: { type: "text" }
                  }
                }
              }
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
    attributes: ["id", "caseReference", "pibCaseNumber"],
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
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        include: [
          {
            model: models.inmate,
            as: "inmate",
            include: ["facilityDetails"]
          }
        ]
      },
      {
        model: models.caseInmate,
        as: "accusedInmates",
        include: [
          {
            model: models.inmate,
            as: "inmate",
            include: ["facilityDetails"]
          }
        ]
      }
    ]
  });

  if (!results.length) {
    console.log("No results were found. Ending script.");
    return 0;
  }

  const operation = { index: { _index: index } };
  const mapPerson = person => {
    if (person?.inmate != null) {
      person = person.inmate;
    } else {
      person;
    }
    let results = {
      full_name: parseSearchTerm(
        `${person.firstName} ${person.lastName}${
          person.suffix ? ` ${person.suffix}` : ""
        }`
      )
    };
    let middle = person.middleName || person.middleInitial;
    if (middle) {
      results.full_name_with_initial = parseSearchTerm(
        `${person.firstName} ${middle} ${person.lastName}${
          person.suffix ? ` ${person.suffix}` : ""
        }`
      );
    }
    return results;
  };

  const bulkOperations = results.flatMap(result => {
    const case_id = result.id;
    const tag = result.caseTags.map(tag => ({
      name: parseSearchTerm(tag.tag.name)
    }));
    const complainantOfficers = result.complainantOfficers.map(mapPerson);
    const complainantInmates = result.complainantInmates.map(mapPerson);
    const accusedInmates = result.accusedInmates.map(mapPerson);
    const accusedOfficers = result.accusedOfficers.map(mapPerson);
    const civilians = result.complainantCivilians.map(mapPerson);
    const narrative = {
      summary: parseSearchTerm(removeTags(result.narrativeSummary)),
      details: parseSearchTerm(removeTags(result.narrativeDetails))
    };
    let case_number = [result.caseReference];
    if (result.pibCaseNumber) {
      case_number.push(result.pibCaseNumber);
    }

    const document = {
      case_id,
      case_number,
      tag,
      accused: accusedOfficers.concat(accusedInmates),
      complainant: complainantOfficers.concat(civilians, complainantInmates),
      narrative
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
