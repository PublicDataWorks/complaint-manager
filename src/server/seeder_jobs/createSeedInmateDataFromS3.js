import { stream } from "winston";
import { getOrdinalDistrict } from "../../sharedUtilities/convertDistrictToOrdinal";

const csvParse = require("csv-parse");
const models = require("../policeDataManager/models");
const _ = require("lodash");
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const winston = require("winston");

const promises = [];
let counter = 0;
const inmatesToUpdate = [];
const inmatesToCreate = [];

const createSeedInmateDataFromS3 = async (
  rosterFileName = "roster.csv",
  shouldCloseConnections = false
) => {
  winston.info("File name", rosterFileName);
  try {
    const s3 = createConfiguredS3Instance();
    const bucketName = config[process.env.NODE_ENV].officerBucket;

    const parser = csvParse({
      cast: parseNullValues,
      columns: true,
      trim: true
    });

    const stream = s3
      .getObject({
        Bucket: bucketName,
        Key: rosterFileName
      })
      .createReadStream()
      .pipe(parser)
      .on("data", seedDataRow => {
        const promise = determineWhetherToCreateOrUpdateInmate(seedDataRow);
        promises.push(promise);
        if (counter++ >= 500) {
          counter = 0;
          stream.pause();
          setTimeout(() => stream.resume(), 1000);
        }
      });

    await new Promise((resolve, reject) => {
      stream.on("end", () => {
        winston.info(`Received ${promises.length} rows of roster data.`);
        Promise.all(promises)
          .then(async () => {
            await models.inmate
              .bulkCreate(inmatesToCreate)
              .then(() => {
                winston.info(`Created ${inmatesToCreate.length} inmates.`);
              })
              .catch(error => {
                winston.error(
                  "Error creating inmates: ",
                  error.name,
                  error.message
                );
                console.dir(error);
                throw error; // do not continue if there is an error.
              });
          })
          .then(async () => {
            await updateInmates(inmatesToUpdate);
            return resolve();
          })
          .catch(error => reject(error));
      });
    });
  } catch (error) {
    winston.error(`Inmates Update Error: ${error}`);
    console.dir(error);
    throw error;
  } finally {
    if (shouldCloseConnections) models.sequelize.close();
  }
};

const determineWhetherToCreateOrUpdateInmate = async seedDataRow => {
  const inmateId = seedDataRow.inmateId;
  const existingInmate = await models.inmate.findByPk(inmateId);
  const updatedSeedDataRow = splitName(seedDataRow);

  if (existingInmate) {
    if (rowDataIsInmateToBeUpdated(updatedSeedDataRow, existingInmate)) {
      inmatesToUpdate.push(updatedSeedDataRow);
    }
  } else {
    inmatesToCreate.push(updatedSeedDataRow);
  }
};

const splitName = seedDataRow => {
  const nameParts = seedDataRow.name.split(" ");
  seedDataRow.lastName = nameParts.pop();
  seedDataRow.firstName = nameParts.join(" ");
  delete seedDataRow.name;
  return seedDataRow;
};

const updateInmates = async inmatesToUpdate => {
  if (inmatesToUpdate.length === 0) {
    winston.info("No inmates to update");
    return;
  }
  let totalCount = 0;
  let errorCount = 0;
  for (let inmateData of inmatesToUpdate) {
    await models.inmate
      .update(inmateData, {
        where: { inmateId: inmateData.inmateId }
      })
      .catch(error => {
        winston.error(
          `Error updating inmates number ${inmateData.inmateId}; `,
          error.message
        );
        errorCount++;
      })
      .then(() => {
        totalCount++;
      });
  }
  winston.info(
    `Finished updating ${totalCount - errorCount} inmates successfully`
  );
  winston.error(`${errorCount} inmate updates failed`);
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

const rowDataIsInmateToBeUpdated = (seedDataRow, existingInmate) => {
  const inmateValuesToCompare = _.omit(existingInmate.dataValues, [
    "createdAt",
    "updatedAt"
  ]);

  const keysToPick = Object.keys(inmateValuesToCompare);
  const seedDataToCompare = _.pick(seedDataRow, keysToPick);

  return !_.isEqualWith(
    inmateValuesToCompare,
    seedDataToCompare,
    isEqualIgnoringType
  );
};

module.exports = createSeedInmateDataFromS3;
