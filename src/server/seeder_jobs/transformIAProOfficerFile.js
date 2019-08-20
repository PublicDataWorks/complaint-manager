const parse = require("csv-parse");
const util = require("util");
const stringify = require("csv-stringify");
const Boom = require("boom");
const _ = require("lodash");
const fs = require("fs");
const promisifyReadFile = util.promisify(fs.readFile);
const promisifiedParse = util.promisify(parse);
const promisifiedStringify = util.promisify(stringify);
const ALLOWED_DISTRICT_VALUES = /(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth) District/;

const transformIAProOfficerFile = async (
  iaProOfficerFilePath,
  outputFilePath
) => {
  const iaProOfficerData = await promisifyReadFile(iaProOfficerFilePath);
  const transformedOfficerData = await transformIAProOfficerData(
    iaProOfficerData
  );

  fs.writeFile(outputFilePath, transformedOfficerData, err => {
    if (err) throw Boom.badImplementation("Couldn't write to file :(");
  });
};

const transformIAProOfficerData = async iaProOfficerData => {
  const parsedRows = await promisifiedParse(iaProOfficerData, {
    columns: true,
    trim: true
  });

  validateHeaders(parsedRows[0]);

  const validRows = parsedRows.filter(row => {
    return row.FNAM !== "" && row.LNAM !== "";
  });

  validRows.forEach(row => {
    removeNonDistrictDivisionValues(row);
    fixCommissionMisspellings(row);
    normalizeSexValues(row);
    normalizeRaceValues(row);
  });

  return await promisifiedStringify(validRows, csvOptions);
};

const removeNonDistrictDivisionValues = row => {
  if (!row["UDTEXT24B"].match(ALLOWED_DISTRICT_VALUES)) {
    row["UDTEXT24B"] = "";
  }
};

const fixCommissionMisspellings = row => {
  row["EMP_TYPE"] = row["EMP_TYPE"].replace("Commisioned", "Commissioned");
};

const normalizeSexValues = row => {
  row["SEX"] = normalizeSexValue(row["SEX"]);
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
      return "Unknown Sex";
    default:
      throw Boom.badData(`Unexpected Sex Value: '${originalSexValue}'`);
  }
};

const normalizeRaceValues = row => {
  row["RACE"] = normalizeRaceValue(row["RACE"]);
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
      return "Unknown Race";
    default:
      throw Boom.badData(`Unexpected Race Value: '${originalRaceValue}'`);
  }
};

const validateHeaders = firstParsedRow => {
  const receivedHeaderColumns = Object.keys(firstParsedRow);
  const expectedHeaderColumns = Object.keys(columns);
  if (_.difference(expectedHeaderColumns, receivedHeaderColumns).length !== 0) {
    throw Boom.badData("Missing required header fields.");
  }
};

const columns = {
  OFFNUM: "officerNumber",
  FNAM: "firstName",
  MNAM: "middleName",
  LNAM: "lastName",
  TITLE: "rank",
  STATUS: "workStatus",
  END_EMPLOY_DT: "endDate",
  DOB: "dob",
  SEX: "sex",
  RACE: "race",
  HIRE_DT: "hireDate",
  UDTEXT24A: "bureau",
  UDTEXT24B: "district",
  UDTEXT24G: "windowsUsername",
  EMP_TYPE: "employeeType",
  CURRENT_SUP_OFFNUM: "supervisorOfficerNumber"
};

const csvOptions = { header: true, columns };

module.exports = { transformIAProOfficerFile, transformIAProOfficerData };
