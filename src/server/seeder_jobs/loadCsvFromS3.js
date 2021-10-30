import { isEqual, omit, pullAllWith } from "lodash";
const csvParse = require("csv-parse");
const config = require("../config/config");
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

const checkForOldItems = (oldItems, newItems) => {
  pullAllWith(newItems, oldItems, isEqual);
  return newItems;
};

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

    const listener = resolve => async () => {
      let oldItems = [];
      let newItems = [];
      try {
        oldItems = await model.findAll();

        oldItems.map(oldItem =>
          omit(oldItem.dataValues, [
            "id",
            "createdAt",
            "updatedAt",
            "deletedAt"
          ])
        );
        newItems = checkForOldItems(oldItems, entries);
      } catch (error) {
        winston.error(`There was an error retrieving data. Error: ${error}`);
      }
      const insertedEntries = await model.bulkCreate(newItems);
      winston.info(
        `Inserted ${insertedEntries.length} out of ${entries.length}.`
      );
      resolve(insertedEntries);
    };

    await new Promise(resolve => {
      stream.on("end", listener(resolve));
    });
  } catch (error) {
    winston.error(
      `There was an error importing some of the data. Error: ${error}`
    );
  }
};

module.exports = loadCsvFromS3;
