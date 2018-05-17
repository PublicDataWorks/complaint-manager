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
    const parser = csvParse({ auto_parse: parse, columns: true, trim: true });
    const entries = [];

    const stream = fs
      .createReadStream(filePath)
      .pipe(parser)
      .on("data", async seedDataRow => {
        entries.push(seedDataRow);
      });

    await new Promise(resolve => {
      stream.on("end", async () => {
        const insertedEntries = await model.bulkCreate(entries);
        resolve(insertedEntries);
      });
    });
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = loadCsv;
