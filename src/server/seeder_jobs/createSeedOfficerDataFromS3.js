const { stream } = require("winston");
const {
  getOrdinalDistrict
} = require("../../sharedUtilities/convertDistrictToOrdinal");

const csvParse = require("csv-parse");
const models = require("../policeDataManager/models");
const _ = require("lodash");
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const winston = require("winston");

const createSeedOfficerDataFromS3 = async (
  officerFileName = "officerSeedData.csv",
  shouldCloseConnections = false
) => {
  const promises = [];
  let counter = 0;
  const officersToUpdate = [];
  const officersToCreate = [];

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
      "updatedAt",
      "districtId",
      "dob"
    ]);

    const keysToPick = Object.keys(officerValuesToCompare);
    const seedDataToCompare = _.pick(seedDataRow, keysToPick);

    return !_.isEqualWith(
      officerValuesToCompare,
      seedDataToCompare,
      isEqualIgnoringType
    );
  };

  const transformDistrictToDistrictId = async seedDataRow => {
    const ordinalDistrict = getOrdinalDistrict(seedDataRow.district);
    if (ordinalDistrict) {
      const foundDistrict = await models.district.findOne({
        where: { name: ordinalDistrict }
      });
      if (foundDistrict) {
        seedDataRow.districtId = foundDistrict.id;
        seedDataRow.district = null;
      }
    }
  };

  const determineWhetherToCreateOrUpdateOfficer = async seedDataRow => {
    const employeeId = seedDataRow.employeeId;
    const existingOfficer = await models.officer.findOne({
      where: { employeeId}
    });

    if (existingOfficer) {
      if (rowDataIsOfficerToBeUpdated(seedDataRow, existingOfficer)) {
        await transformDistrictToDistrictId(seedDataRow);
        officersToUpdate.push(seedDataRow);
      }
    } else {
      await transformDistrictToDistrictId(seedDataRow);
      officersToCreate.push(seedDataRow);
    }
  };

  const updateOfficers = async officersToUpdate => {
    if (officersToUpdate.length === 0) {
      winston.info("No officers to update");
      return;
    }
    let totalCount = 0;
    let errorCount = 0;
    for (let officerData of officersToUpdate) {
      if (!officerData.workStatus || officerData.workStatus === "") {
        delete officerData.workStatus;
      }
      await models.officer
        .update(officerData, {
          where: { employeeId: officerData.employeeId }
        })
        .catch(error => {
          winston.error(
            `Error updating officer number ${officerData.employeeId}; `,
            error.message
          );
          errorCount++;
        })
        .then(() => {
          totalCount++;
        });
    }
    winston.info(
      `Finished updating ${totalCount - errorCount} officers successfully`
    );
    winston.error(`${errorCount} officer updates failed`);
  };

  winston.info("File name: " + officerFileName);
  try {
    const s3 = createConfiguredS3Instance();
    const officerBucketName = config[process.env.NODE_ENV].officerBucket;

    const parser = csvParse({
      cast: parseNullValues,
      columns: true,
      trim: true
    });

    const object = await s3.getObject({
      Bucket: officerBucketName,
      Key: officerFileName
    });

    const stream = object.Body.pipe(parser).on("data", seedDataRow => {
      const promise = determineWhetherToCreateOrUpdateOfficer(seedDataRow);
      promises.push(promise);
      if (counter++ >= 100) {
        counter = 0;
        stream.pause();
        setTimeout(() => stream.resume(), 1000);
      }
    });

    await new Promise((resolve, reject) => {
      stream.on("end", () => {
        winston.info(`Received ${promises.length} rows of officer data.`);
        Promise.all(promises)
          .then(async () => {
            await models.officer
              .bulkCreate(officersToCreate)
              .then(() => {
                winston.info(`Created ${officersToCreate.length} officers.`);
              })
              .catch(error => {
                winston.error(
                  "Error creating officers: ",
                  error.name,
                  error.message
                );
                console.dir(error);
                throw error; // do not continue if there is an error.
              });
          })
          .then(async () => {
            await updateOfficers(officersToUpdate);
            return resolve();
          })
          .catch(error => reject(error));
      });
    });
  } catch (error) {
    winston.error(`Officer Update Error: ${error}`);
    console.dir(error);
    throw error;
  } finally {
    if (shouldCloseConnections) models.sequelize.close();
  }
};

module.exports = createSeedOfficerDataFromS3;
