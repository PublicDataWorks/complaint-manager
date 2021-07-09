const parse = require("csv-parse");
const util = require("util");
const stringify = require("csv-stringify");
const Boom = require("boom");
const _ = require("lodash");
const fs = require("fs");
const promisifyReadFile = util.promisify(fs.readFile);
const promisifiedParse = util.promisify(parse);
const promisifiedStringify = util.promisify(stringify);

const normalizeSexAndRaceValues = async (
  iaProOfficerFilePath,
  outputFilePath
) => {
  const iaProOfficerData = await promisifyReadFile(iaProOfficerFilePath);
  const transformedOfficerData = await normalizeOfficerData(iaProOfficerData);

  fs.writeFile(outputFilePath, transformedOfficerData, err => {
    if (err) throw Boom.badImplementation("Couldn't write to file :(");
  });
};

const normalizeOfficerData = async iaProOfficerData => {
  const parsedRows = await promisifiedParse(iaProOfficerData, {
    columns: true,
    trim: true
  });

  parsedRows.forEach(row => {
    normalizeSexValues(row);
    normalizeRaceValues(row);
  });

  return await promisifiedStringify(parsedRows, csvOptions);
};

const normalizeSexValues = row => {
  row["sex"] = normalizeSexValue(row["sex"]);
};

const normalizeSexValue = originalSexValue => {
  switch (originalSexValue) {
    case "F":
    case "Female":
      return "F";
    case "M":
    case "Male":
      return "M";
    case "N":
    case "Sex-Unk":
    case "":
    case "''":
    case '""':
    case "NULL":
      return "Unknown Sex";
    default:
      throw Boom.badData(`Unexpected Sex Value: '${originalSexValue}'`);
  }
};

const normalizeRaceValues = row => {
  row["race"] = normalizeRaceValue(row["race"]);
};

const normalizeRaceValue = originalRaceValue => {
  switch (originalRaceValue) {
    case "American Ind":
      return "Native American";
    case "Asian/Pacif":
    case "Asian/Pacifi":
      return "Asian / Pacific Islander";
    case "Black":
      return "Black / African American";
    case "Hispanic":
      return "Hispanic";
    case "White":
      return "White";
    case "Not Applicab":
    case "Not Specifie":
    case "Race-Unknown":
    case "":
    case "''":
    case '""':
    case "NULL":
      return "Unknown Race";
    default:
      throw Boom.badData(`Unexpected Race Value: '${originalRaceValue}'`);
  }
};

const columns = {
  officerNumber: "officerNumber",
  firstName: "firstName",
  middleName: "middleName",
  lastName: "lastName",
  rank: "rank",
  workStatus: "workStatus",
  endDate: "endDate",
  sex: "sex",
  race: "race",
  hireDate: "hireDate",
  bureau: "bureau",
  district: "district",
  windowsUsername: "windowsUsername",
  employeeType: "employeeType",
  supervisorOfficerNumber: "supervisorOfficerNumber"
};

const csvOptions = { header: true, columns };

module.exports = { normalizeSexAndRaceValues };
