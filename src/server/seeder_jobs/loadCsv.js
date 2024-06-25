const fs = require("fs");
const csvParse = require("csv-parse");
const path = require("path");

const loadCsv = async (fileName, model) => {
  const parse = value => {
    if (value === "" || value === "NULL") return null;
    return value;
  };

  const filePath = path.join(__dirname, fileName);
  try {
    const parser = csvParse({ cast: parse, columns: true, trim: true });
    const entries = [];

    const stream = fs
      .createReadStream(filePath)
      .pipe(parser)
      .on("data", async seedDataRow => {
        entries.push(seedDataRow);
      });

    await new Promise(resolve => {
      stream.on("end", async () => {
        try {
          const insertedEntries = await model.bulkCreate(entries);
          resolve(insertedEntries);
        } catch (err) {
          console.error(err);
          throw err;
        }
      });
    });
  } catch (error) {
    throw error; // do not continue if there is an error.
  }
};

module.exports = loadCsv;
