const csvParse = require("csv-parse");
const config = require("../config/config");
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const models = require("../complaintManager/models");
const winston = require("winston");

const parseNullValues = value => (!value || value === "NULL" ? null : value);

const loadCsvFromS3 = async (fileName, model) => {
  try {
    const s3 = createConfiguredS3Instance();
    const Bucket = process.env.SEED_DATA_BUCKET_NAME || "noipm-seed-files";
    const Key = fileName;
    winston.info("Processing CSVs in S3...");

    const csvParser = csvParse({
      cast: parseNullValues,
      columns: true,
      trim: true
    });

    const entries = [];

    const stream = s3
      .getObject({ Bucket, Key })
      .createReadStream()
      .pipe(csvParser)
      .on("data", row => entries.push(row))
      .on("error", error => {
        winston.error(
          `There was an error emitted from the stream. Error: ${error}`
        );
      });

    await new Promise(resolve => {
      stream.on("end", async () => {
        const insertedEntries = await model.bulkCreate(entries);
        winston.info(
          `Inserted ${insertedEntries.length} out of ${entries.length}.`
        );
        resolve(insertedEntries);
      });
    });
  } catch (error) {
    winston.error(
      `There was an error importing some of the data. Error: ${error}`
    );
  }
};

module.exports = loadCsvFromS3;
