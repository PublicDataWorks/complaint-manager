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

const bulkUploadOfficerDataFromS3 = async (
  //officerFileName = "officerSeedData.csv",
  officerFileName = "massOfficerUploadExample.csv",
  shouldCloseConnections = false
) => {
  console.log("officerFileName: ", officerFileName);
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
    // ---- IF THERE IS NO EMPLOYEE ID, LOG ERROR AND RETURN
    if (!employeeId) {
      winston.error("Officer data missing employeeId");
      return;
    }

    // ---- CHECK IF SUPERVISOR EMPLOYEE ID HAS MATCHING EMPLOYEE ID
    // if (seedDataRow.supervisorEmployeeId) {
    //   const supervisor = await models.officer.findOne({
    //     where: { employeeId: seedDataRow.supervisorEmployeeId }
    //   });
    //   if (!supervisor) {
    //     // --- SET SUPERVISOR EMPLOYEE ID TO NULL
    //     seedDataRow.supervisorEmployeeId = null;
    //     winston.error(
    //       `Supervisor employeeId ${seedDataRow.supervisorEmployeeId} not found for employeeId ${employeeId}`
    //     );
    //   }
    // }

    // ---- CHECK IF EMPLOYEE_TYPE MATCHES ENUM
    //--
    //--
    //--

    const existingOfficer = await models.officer.findOne({
      where: { employeeId }
    });

    await transformDistrictToDistrictId(seedDataRow);

    if (existingOfficer) {
      if (rowDataIsOfficerToBeUpdated(seedDataRow, existingOfficer)) {
        officersToUpdate.push(seedDataRow);
      }
    } else {
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
          // DISPLAY ERROR ON FRONT END, IGNORE ROW, AND CONTINUE

          // After a certain amount of errors, stop the process and display an error message
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
    console.log("officerBucketName: ", officerBucketName);

    const parser = csvParse({
      cast: parseNullValues,
      columns: true,
      trim: true
    });

    const object = await s3.getObject({
      Bucket: officerBucketName,
      Key: officerFileName
    });
    console.log("s3.getObject object: ", object);

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
            for (let officer of officersToCreate) {
              try {
                await models.officer.create(officer);
              } catch (error) {
                winston.error(
                  "Error creating officer: ",
                  error.name,
                  error.message
                );
                console.dir(error);
                // DISPLAY ERROR ON FRONT END, IGNORE ROW, AND CONTINUE
              }
            }
            winston.info(`Finished creating officers.`);
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

module.exports = bulkUploadOfficerDataFromS3;
