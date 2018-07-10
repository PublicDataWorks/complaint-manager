const csvParse = require("csv-parse");
const models = require("../models");
const _ = require("lodash");
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const config = require("../config/config");
const winston = require("winston");

const promises = [];
const officersToUpdate = [];
const officersToCreate = [];

const updateOfficerDataFromS3 = async () => {
  try {
    const s3 = createConfiguredS3Instance();
    const officerBucketName = config[process.env.NODE_ENV].officerBucket;
    const officerFileName =
      process.env.OFFICER_FILE_NAME || "officerSeedData.csv";

    const parser = csvParse({
      auto_parse: parseNullValues,
      columns: true,
      trim: true
    });

    const stream = s3
      .getObject({
        Bucket: officerBucketName,
        Key: officerFileName
      })
      .createReadStream()
      .pipe(parser)
      .on("data", onData);

    await new Promise((resolve, reject) => {
      stream.on("end", () => {
        Promise.all(promises)
          .then(() => {
            return models.officer.bulkCreate(officersToCreate);
          })
          .then(() => {
            return updateOfficers(officersToUpdate);
          })
          .then(() => {
            return resolve();
          })
          .catch(error => reject(error));
      });
    });
  } catch (error) {
    winston.error(`Officer Update Error: ${error}`);
  }
};

const createOrUpdateOfficer = seedDataRow => {
  return new Promise(async resolve => {
    const officerNumber = seedDataRow.officerNumber;
    const existingOfficer = await models.officer.find({
      where: { officerNumber }
    });

    if (existingOfficer) {
      if (rowDataIsOfficerToBeUpdated(seedDataRow, existingOfficer)) {
        officersToUpdate.push(seedDataRow);
      }
    } else {
      officersToCreate.push(seedDataRow);
    }
    return resolve();
  });
};

const onData = seedDataRow => {
  const promise = createOrUpdateOfficer(seedDataRow);
  promises.push(promise);
};

const updateOfficers = officersToUpdate => {
  return new Promise(async resolve => {
    const promises = officersToUpdate.map(officer => {
      return models.officer.update(officer, {
        where: { officerNumber: officer.officerNumber }
      });
    });
    await Promise.all(promises);
    return resolve();
  });
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

const rowDataIsOfficerToBeUpdated = (seedDataRow, existingOfficer) => {
  const officerValuesToCompare = _.omit(existingOfficer.dataValues, [
    "id",
    "createdAt",
    "updatedAt"
  ]);

  const keysToPick = Object.keys(officerValuesToCompare);
  const seedDataToCompare = _.pick(seedDataRow, keysToPick);

  return !_.isEqualWith(
    officerValuesToCompare,
    seedDataToCompare,
    isEqualIgnoringType
  );
};

module.exports = updateOfficerDataFromS3;
