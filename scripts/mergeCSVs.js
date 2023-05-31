// lots of this logic is specific to the specifically janky pair of CSVs
// that we got from NOIPM, but feel free to copy this and adapt for other use-cases
const fs = require("fs");
const csvParse = require("csv-parse");
const stringify = require("csv-stringify");
const path = require("path");

const mergeCSVs = async (fileName1, fileName2, key) => {
  const parse = value => {
    if (value === "" || value === "NULL") return "";
    return value;
  };

  const filePath = fileName1.startsWith("/")
    ? fileName1
    : path.join(__dirname, fileName1);
  const parser = csvParse({ cast: parse, columns: true, trim: true });
  const entries = {};
  try {
    const stream = fs
      .createReadStream(filePath)
      .pipe(parser)
      .on("data", async seedDataRow => {
        entries[seedDataRow[key]] = seedDataRow;
      });

    await new Promise(resolve => {
      stream.on("end", () => {
        resolve();
      });
    });
  } catch (error) {
    console.log("error reading the first file");
    throw error; // do not continue if there is an error.
  }

  const filePath2 = fileName2.startsWith("/")
    ? fileName2
    : path.join(__dirname, fileName2);
  let newCsv;
  try {
    const newParser = csvParse({ cast: parse, columns: true, trim: true });
    const stream2 = fs.createReadStream(filePath2).pipe(newParser);

    stream2.on("data", async seedDataRow => {
      if (entries[seedDataRow[key]]) {
        entries[seedDataRow[key]] = {
          ...seedDataRow,
          ...entries[seedDataRow[key]]
        };
      } else {
        const nameSplit = seedDataRow.employee.split(", ");
        const firstNameSplit = nameSplit[1].split(" ");
        entries[seedDataRow[key]] = {
          ...seedDataRow,
          lastName: nameSplit[0],
          middleName: firstNameSplit.length === 1 ? "" : firstNameSplit.pop(),
          firstName: firstNameSplit.join(" ")
        };
      }

      entries[seedDataRow[key]].workStatus =
        !seedDataRow.endDate || seedDataRow.endDate === ""
          ? "Active"
          : "Inactive";
    });

    newCsv = await new Promise((resolve, reject) => {
      stream2.on("end", () => {
        const keys = [
          "officerNumber",
          "firstName",
          "middleName",
          "lastName",
          "rank",
          "workStatus",
          "endDate",
          "sex",
          "race",
          "hireDate",
          "bureau",
          "district",
          "employeeType",
          "supervisorOfficerNumber"
        ];
        stringify(
          [
            keys,
            ...Object.values(entries).map(row => {
              return keys.map(key => row[key]);
            })
          ],
          (err, output) => {
            if (err) {
              reject(err);
            } else {
              resolve(output);
            }
          }
        );
      });
    });
  } catch (error) {
    console.log("error reading the second file");
    throw error; // do not continue if there is an error.
  }

  const outputPath = path.join(__dirname, "output.csv");
  fs.writeFileSync(outputPath, newCsv);
  console.log("Successfully output new file to", outputPath);
};

mergeCSVs(process.argv[2], process.argv[3], process.argv[4]).catch(error => {
  console.error(error);
  process.exit(1);
});
