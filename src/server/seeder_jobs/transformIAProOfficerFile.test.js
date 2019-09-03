import { BAD_DATA_ERRORS } from "../../sharedUtilities/errorMessageConstants";

const fs = require("fs");
const path = require("path");
const util = require("util");
const { transformIAProOfficerData } = require("./transformIAProOfficerFile");
const Boom = require("boom");

describe("transformIAProOfficerFile", () => {
  let iaProOfficerBufferedData, transformedOfficerDataString;

  describe("with correct headers", () => {
    beforeEach(async () => {
      iaProOfficerBufferedData = await readFile(
        "testIAProOfficerFile.correctHeaders.csv"
      );
      transformedOfficerDataString = await transformIAProOfficerData(
        iaProOfficerBufferedData
      );
    });

    test("parses correct headers with values", async () => {
      const rows = transformedOfficerDataString.split("\n");
      const headerArray = rows[0].split(",");
      const valuesArray = rows[1].split(",");
      expect(headerArray).toEqual([
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
        "windowsUsername",
        "employeeType",
        "supervisorOfficerNumber"
      ]);

      expect(valuesArray).toEqual([
        "1",
        "Bianca",
        "B",
        "Banks",
        "DEFAULT",
        "Terminated",
        "1/1/80 0:00",
        "F",
        "Native American",
        "1/1/20 0:00",
        "MSB - Management Service Bureau",
        "First District",
        "2222",
        "Non-Commissioned",
        "1234"
      ]);
    });

    test("ignores rows containing empty first or last names", async () => {
      transformedOfficerDataString = transformedOfficerDataString.replace(
        /\n$/,
        ""
      ); //remove final line break
      const expectedRowCount =
        iaProOfficerBufferedData.toString().split("\n").length - 3;
      const receivedRows = transformedOfficerDataString.split("\n");
      expect(receivedRows.length).toEqual(expectedRowCount);
      expect(transformedOfficerDataString).not.toContain("MissingFirstName");
      expect(transformedOfficerDataString).not.toContain(
        "MissingFirstAndLastName"
      );
      expect(transformedOfficerDataString).not.toContain("MissingLastName");
    });

    test("removes non-district values from division field", async () => {
      const rows = transformedOfficerDataString.split("\n");
      const anotherDivisionRow = rows[2];
      const districtsRow = rows[3];

      expect(anotherDivisionRow.split(",")[11]).toEqual("");
      expect(anotherDivisionRow).not.toContain(
        "Education/Training & Recruitment Division"
      );

      expect(districtsRow.split(",")[11]).toEqual("");
      expect(districtsRow).not.toContain("Districts");
    });

    test("corrects spelling of 'commissioned' in the employee type field", async () => {
      const nonCommisionedRow = 2;
      const comisionedRow = 3;
      const employeeTypeColumn = 13;

      //verify starting data as expected in case someone changes csv file
      const originalRows = iaProOfficerBufferedData.toString().split("\n");
      expect(
        originalRows[nonCommisionedRow].split(",")[employeeTypeColumn]
      ).toEqual("Non-Commisioned");
      expect(
        originalRows[comisionedRow].split(",")[employeeTypeColumn]
      ).toEqual("Commisioned");

      const transformedRows = transformedOfficerDataString.split("\n");
      expect(
        transformedRows[nonCommisionedRow].split(",")[employeeTypeColumn]
      ).toEqual("Non-Commissioned");
      expect(
        transformedRows[comisionedRow].split(",")[employeeTypeColumn]
      ).toEqual("Commissioned");
    });

    test("normalizes sex values", async () => {
      const fSexRowIndex = 1;
      const mSexRowIndex = 2;
      const femaleSexRowIndex = 3;
      const maleSexRowIndex = 4;
      const nSexRowIndex = 5;
      const sexUnkSexRowIndex = 6;
      const nullSexRowIndex = 7;
      const emptyStringSexRowIndex = 8;
      const sexRowIndex = 7;

      //verify starting data as expected in case someone changes csv file
      const originalRows = iaProOfficerBufferedData.toString().split("\n");
      expect(originalRows[fSexRowIndex].split(",")[sexRowIndex]).toEqual("F");
      expect(originalRows[mSexRowIndex].split(",")[sexRowIndex]).toEqual("M");
      expect(originalRows[femaleSexRowIndex].split(",")[sexRowIndex]).toEqual("Female");
      expect(originalRows[maleSexRowIndex].split(",")[sexRowIndex]).toEqual("Male");
      expect(originalRows[nSexRowIndex].split(",")[sexRowIndex]).toEqual("N");
      expect(originalRows[sexUnkSexRowIndex].split(",")[sexRowIndex]).toEqual("Sex-Unk");
      expect(originalRows[nullSexRowIndex].split(",")[sexRowIndex]).toEqual("");
      expect(originalRows[emptyStringSexRowIndex].split(",")[sexRowIndex]).toEqual("''");

      const transformedRows = transformedOfficerDataString.split("\n");
      expect(transformedRows[fSexRowIndex].split(",")[sexRowIndex]).toEqual("F");
      expect(transformedRows[mSexRowIndex].split(",")[sexRowIndex]).toEqual("M");
      expect(transformedRows[femaleSexRowIndex].split(",")[sexRowIndex]).toEqual("F");
      expect(transformedRows[maleSexRowIndex].split(",")[sexRowIndex]).toEqual("M");
      expect(transformedRows[nSexRowIndex].split(",")[sexRowIndex]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[sexUnkSexRowIndex].split(",")[sexRowIndex]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[nullSexRowIndex].split(",")[sexRowIndex]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[emptyStringSexRowIndex].split(",")[sexRowIndex]).toEqual(
        "Unknown Sex"
      );
    });

    test("throws error if unexpected sex", async () => {
      const inputCsvWithUnexpectedSex = iaProOfficerBufferedData
        .toString()
        .replace("Female", "ABC");
      await expect(
        transformIAProOfficerData(inputCsvWithUnexpectedSex)
      ).rejects.toEqual(Boom.badData("Unexpected Sex Value: 'ABC'"));
    });

    test("normalizes race values", async () => {
      const americanIndRowIndex = 1;
      const asiaPacifRowIndex = 2;
      const asianPacifiRowIndex = 3;
      const blackRowIndex = 4;
      const hispanicRowIndex = 5;
      const whiteRowIndex = 6;
      const notApplicabRowIndex = 7;
      const notSpecifieRowIndex = 8;
      const raceUnknownRowIndex = 9;
      const blankRaceRowIndex = 10;
      const raceRowIndex = 8;

      //verify starting data as expected in case someone changes csv file
      const originalRows = iaProOfficerBufferedData.toString().split("\n");
      expect(originalRows[americanIndRowIndex].split(",")[raceRowIndex]).toEqual(
        "American Ind"
      );
      expect(originalRows[asiaPacifRowIndex].split(",")[raceRowIndex]).toEqual(
        "Asian/Pacif"
      );
      expect(originalRows[asianPacifiRowIndex].split(",")[raceRowIndex]).toEqual(
        "Asian/Pacifi"
      );
      expect(originalRows[blackRowIndex].split(",")[raceRowIndex]).toEqual("Black");
      expect(originalRows[hispanicRowIndex].split(",")[raceRowIndex]).toEqual("Hispanic");
      expect(originalRows[whiteRowIndex].split(",")[raceRowIndex]).toEqual("White");
      expect(originalRows[notApplicabRowIndex].split(",")[raceRowIndex]).toEqual(
        "Not Applicab"
      );
      expect(originalRows[notSpecifieRowIndex].split(",")[raceRowIndex]).toEqual(
        "Not Specifie"
      );
      expect(originalRows[raceUnknownRowIndex].split(",")[raceRowIndex]).toEqual(
        "Race-Unknown"
      );
      expect(originalRows[blankRaceRowIndex].split(",")[raceRowIndex]).toEqual("");

      const transformedRows = transformedOfficerDataString.split("\n");
      expect(transformedRows[americanIndRowIndex].split(",")[raceRowIndex]).toEqual(
        "Native American"
      );
      expect(transformedRows[asiaPacifRowIndex].split(",")[raceRowIndex]).toEqual(
        "Asian / Pacific Islander"
      );
      expect(transformedRows[asianPacifiRowIndex].split(",")[raceRowIndex]).toEqual(
        "Asian / Pacific Islander"
      );
      expect(transformedRows[blackRowIndex].split(",")[raceRowIndex]).toEqual(
        "Black / African American"
      );
      expect(transformedRows[hispanicRowIndex].split(",")[raceRowIndex]).toEqual(
        "Hispanic"
      );
      expect(transformedRows[whiteRowIndex].split(",")[raceRowIndex]).toEqual("White");
      expect(transformedRows[notApplicabRowIndex].split(",")[raceRowIndex]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[notSpecifieRowIndex].split(",")[raceRowIndex]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[raceUnknownRowIndex].split(",")[raceRowIndex]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[blankRaceRowIndex].split(",")[raceRowIndex]).toEqual(
        "Unknown Race"
      );
    });

    test("throws error if unexpected race value", async () => {
      const inputCsvWithUnexpectedRace = iaProOfficerBufferedData
        .toString()
        .replace("American Ind", "XYZ");
      await expect(
        transformIAProOfficerData(inputCsvWithUnexpectedRace)
      ).rejects.toEqual(Boom.badData("Unexpected Race Value: 'XYZ'"));
    });
  });

  describe("with incorrect headers", () => {
    beforeEach(async () => {
      iaProOfficerBufferedData = await readFile(
        "testIAProOfficerFile.missingHeaders.csv"
      );
    });

    test("throws error if required headers are missing", async () => {
      await expect(
        transformIAProOfficerData(iaProOfficerBufferedData)
      ).rejects.toEqual(Boom.badData("Missing required header fields."));
    });
  });
});

const readFile = async filename => {
  const filePath = path.resolve(__dirname, filename);
  const promisifyReadFile = util.promisify(fs.readFile);
  return await promisifyReadFile(filePath);
};
