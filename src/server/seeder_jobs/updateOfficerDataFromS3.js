const csvParse = require("csv-parse");
const models = require("../models");
const _ = require("lodash");
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const config = require("../config/config");

const updateOfficerDataFromS3 = async () => {
  try {
    const promises = [];
    const officersToCreate = [];
    const s3 = createConfiguredS3Instance();
    const officerBucketName = config[process.env.NODE_ENV].officerBucket;
    const officerFileName =
      process.env.OFFICER_FILE_NAME || "updatedOfficerSeedData.csv";

    const parser = csvParse({
      auto_parse: parseNullValues,
      columns: true,
      trim: true
    });

    const createOrUpdateOfficer = seedDataRow => {
      return new Promise(async resolve => {
        const officerNumber = seedDataRow.officerNumber;
        const existingOfficer = await models.officer.find({
          where: { officerNumber }
        });

        if (existingOfficer) {
          const officerValuesToCompare = _.omit(existingOfficer.dataValues, [
            "id",
            "createdAt",
            "updatedAt"
          ]);

          const keysToPick = Object.keys(officerValuesToCompare);
          const seedDataToCompare = _.pick(seedDataRow, keysToPick);

          if (
            !_.isEqualWith(
              officerValuesToCompare,
              seedDataToCompare,
              isEqualIgnoringType
            )
          ) {
            await existingOfficer.update(seedDataRow);
          }
        } else {
          officersToCreate.push(seedDataRow);
        }
        resolve();
      });
    };

    const onData = seedDataRow => {
      const promise = createOrUpdateOfficer(seedDataRow);
      promises.push(promise);
    };

    const stream = s3
      .getObject({
        Bucket: officerBucketName,
        Key: officerFileName
      })
      .createReadStream()
      .pipe(parser)
      .on("data", onData);

    await new Promise(resolve => {
      stream.on("end", async () => {
        await Promise.all(promises);
        await models.officer.bulkCreate(officersToCreate);
        return resolve();
      });
    });
  } catch (e) {
    console.log("Error:", e);
  }
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

module.exports = updateOfficerDataFromS3;
