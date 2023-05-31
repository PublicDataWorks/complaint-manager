import winston from "winston";
import createConfiguredS3Instance from "../createConfiguredS3Instance";
import _ from "lodash";
const csvParse = require("csv-parse");
import models from "../policeDataManager/models";
import { Op } from "sequelize";

const promises = [];
const allegationsToUpdate = [];
const allegationsToCreate = [];

const updateSeedAllegationDataFromS3 = async filename => {
  try {
    const s3 = createConfiguredS3Instance();
    const Bucket = "noipm-seed-files";
    const Key = filename;
    winston.info("Processing CSVs in S3...");

    const csvParser = csvParse({
      cast: parseNullValues,
      columns: true,
      trim: true
    });

    const object = await s3.getObject({ Bucket, Key });
    const stream = object.Body.pipe(csvParser).on("data", onData);

    await new Promise((resolve, reject) => {
      stream.on("end", () => {
        winston.info(`Received ${promises.length} rows of allegation data`);
        Promise.all(promises)
          .then(async () => {
            await models.allegation
              .bulkCreate(allegationsToCreate)
              .then(() => {
                winston.info(
                  `Created ${allegationsToCreate.length} allegations.`
                );
              })
              .catch(error => {
                winston.error(
                  "Error creating allegations: ",
                  error.name,
                  error.message
                );
                console.dir(error);
                throw error;
              });
          })
          .then(async () => {
            await updateAllegations(allegationsToUpdate);
            return resolve();
          });
      });
    });
  } catch (error) {
    winston.error(`Allegation Update Error: ${error}`);
    console.dir(error);
  }
};

const onData = seedDataRow => {
  const promise = determineWhetherToCreateOrUpdateAllegation(seedDataRow);
  promises.push(promise);
};

const updateAllegations = async allegationsToUpdate => {
  if (allegationsToUpdate.length === 0) {
    winston.info("No allegations to update");
    return;
  }

  let totalCount = 0;
  let errorCount = 0;

  for (let allegationData of allegationsToUpdate) {
    await models.allegation
      .update(allegationData, {
        where: { id: allegationData.id }
      })
      .catch(error => {
        winston.error(
          `Error updating allegation id ${allegationData.id} `,
          error.message
        );
        errorCount++;
      })
      .then(() => {
        totalCount++;
      });
  }

  winston.info(
    `Finished updating ${totalCount - errorCount} allegations successfully`
  );

  winston.error(`${errorCount} allegations updates failed`);
};

const parseNullValues = value => {
  if (value === "" || value === "NULL") return null;
  return value;
};

const isEqualIgnoringType = (value1, value2) => {
  if (value1 == value2) {
    return true;
  }
};

const determineWhetherToCreateOrUpdateAllegation = async seedDataRow => {
  const rule = seedDataRow.rule;
  const paragraph = seedDataRow.paragraph;
  const directive = seedDataRow.directive;

  let ruleWhere, paragraphWhere, directiveWhere;

  if (!rule) {
    ruleWhere = { [Op.eq]: null };
  } else if (!rule.includes(":")) {
    ruleWhere = rule;
  } else {
    ruleWhere = { [Op.like]: `${rule.split(":")[0]}%` };
  }

  if (!paragraph) {
    paragraphWhere = { [Op.eq]: null };
  } else if (!paragraph.includes("-")) {
    paragraphWhere = paragraph;
  } else {
    paragraphWhere = { [Op.like]: `${paragraph.split("-")[0]}%` };
  }

  if (!directive) {
    directiveWhere = { [Op.eq]: null };
  } else if (!directive.includes(" ")) {
    directiveWhere = directive;
  } else {
    directiveWhere = { [Op.like]: `${directive.split(" ")[1]}%` };
  }

  const existingAllegation = await models.allegation.findOne({
    where: {
      rule: ruleWhere,
      paragraph: paragraphWhere,
      directive: directiveWhere
    }
  });
  if (existingAllegation) {
    if (oldAllegationToBeUpdated(seedDataRow, existingAllegation)) {
      allegationsToUpdate.push({ ...seedDataRow, id: existingAllegation.id });
    }
  } else {
    allegationsToCreate.push(seedDataRow);
  }
};

const oldAllegationToBeUpdated = (seedRowData, existingAllegation) => {
  const allegationValuesToCompare = _.omit(existingAllegation.dataValues, [
    "id",
    "createdAt",
    "updatedAt"
  ]);

  const keysToPick = Object.keys(allegationValuesToCompare);
  const seedDataToCompare = _.pick(seedRowData, keysToPick);

  return !_.isEqualWith(
    allegationValuesToCompare,
    seedDataToCompare,
    isEqualIgnoringType
  );
};

module.exports = updateSeedAllegationDataFromS3;
