const csvParse = require("csv-parse");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const createConfiguredS3Instance = require("../createConfiguredS3Instance");
const winston = require("winston");

winston.configure({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize: true
    })
  ],
  level: "info",
  colorize: true
});

const parseNullValues = value => (!value || value === "NULL" ? null : value);

const loadCsvIntoAnArray = async fileName => {
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
    const object = await s3.getObject({ Bucket, Key });

    const stream = object.Body.pipe(csvParser)
      .on("data", row => entries.push(row))
      .on("error", error => {
        winston.error(
          `There was an error emitted from the stream. Error: ${error}`
        );
      });

    const listener = resolve => async () => {
      resolve(entries);
    };

    return await new Promise(resolve => {
      stream.on("end", listener(resolve));
    });
  } catch (error) {
    winston.error(
      `There was an error importing some of the data. Error: ${error}`
    );
    throw error;
  }
};

module.exports = loadCsvIntoAnArray;
