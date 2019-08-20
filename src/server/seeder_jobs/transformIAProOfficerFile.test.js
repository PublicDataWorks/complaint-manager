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
        "dob",
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
        "1/11/00 0:00",
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

      expect(anotherDivisionRow.split(",")[12]).toEqual("");
      expect(anotherDivisionRow).not.toContain(
        "Education/Training & Recruitment Division"
      );

      expect(districtsRow.split(",")[12]).toEqual("");
      expect(districtsRow).not.toContain("Districts");
    });

    test("corrects spelling of 'commissioned' in the employee type field", async () => {
      const nonCommisionedRow = 2;
      const comisionedRow = 3;
      const employeeTypeColumn = 14;

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

      //verify starting data as expected in case someone changes csv file
      const originalRows = iaProOfficerBufferedData.toString().split("\n");
      expect(originalRows[fSexRowIndex].split(",")[8]).toEqual("F");
      expect(originalRows[mSexRowIndex].split(",")[8]).toEqual("M");
      expect(originalRows[femaleSexRowIndex].split(",")[8]).toEqual("Female");
      expect(originalRows[maleSexRowIndex].split(",")[8]).toEqual("Male");
      expect(originalRows[nSexRowIndex].split(",")[8]).toEqual("N");
      expect(originalRows[sexUnkSexRowIndex].split(",")[8]).toEqual("Sex-Unk");
      expect(originalRows[nullSexRowIndex].split(",")[8]).toEqual("");
      expect(originalRows[emptyStringSexRowIndex].split(",")[8]).toEqual("''");

      const transformedRows = transformedOfficerDataString.split("\n");
      expect(transformedRows[fSexRowIndex].split(",")[8]).toEqual("F");
      expect(transformedRows[mSexRowIndex].split(",")[8]).toEqual("M");
      expect(transformedRows[femaleSexRowIndex].split(",")[8]).toEqual("F");
      expect(transformedRows[maleSexRowIndex].split(",")[8]).toEqual("M");
      expect(transformedRows[nSexRowIndex].split(",")[8]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[sexUnkSexRowIndex].split(",")[8]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[nullSexRowIndex].split(",")[8]).toEqual(
        "Unknown Sex"
      );
      expect(transformedRows[emptyStringSexRowIndex].split(",")[8]).toEqual(
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

      //verify starting data as expected in case someone changes csv file
      const originalRows = iaProOfficerBufferedData.toString().split("\n");
      expect(originalRows[americanIndRowIndex].split(",")[9]).toEqual(
        "American Ind"
      );
      expect(originalRows[asiaPacifRowIndex].split(",")[9]).toEqual(
        "Asian/Pacif"
      );
      expect(originalRows[asianPacifiRowIndex].split(",")[9]).toEqual(
        "Asian/Pacifi"
      );
      expect(originalRows[blackRowIndex].split(",")[9]).toEqual("Black");
      expect(originalRows[hispanicRowIndex].split(",")[9]).toEqual("Hispanic");
      expect(originalRows[whiteRowIndex].split(",")[9]).toEqual("White");
      expect(originalRows[notApplicabRowIndex].split(",")[9]).toEqual(
        "Not Applicab"
      );
      expect(originalRows[notSpecifieRowIndex].split(",")[9]).toEqual(
        "Not Specifie"
      );
      expect(originalRows[raceUnknownRowIndex].split(",")[9]).toEqual(
        "Race-Unknown"
      );
      expect(originalRows[blankRaceRowIndex].split(",")[9]).toEqual("");

      const transformedRows = transformedOfficerDataString.split("\n");
      expect(transformedRows[americanIndRowIndex].split(",")[9]).toEqual(
        "Native American"
      );
      expect(transformedRows[asiaPacifRowIndex].split(",")[9]).toEqual(
        "Asian / Pacific Islander"
      );
      expect(transformedRows[asianPacifiRowIndex].split(",")[9]).toEqual(
        "Asian / Pacific Islander"
      );
      expect(transformedRows[blackRowIndex].split(",")[9]).toEqual(
        "Black / African American"
      );
      expect(transformedRows[hispanicRowIndex].split(",")[9]).toEqual(
        "Hispanic"
      );
      expect(transformedRows[whiteRowIndex].split(",")[9]).toEqual("White");
      expect(transformedRows[notApplicabRowIndex].split(",")[9]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[notSpecifieRowIndex].split(",")[9]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[raceUnknownRowIndex].split(",")[9]).toEqual(
        "Unknown Race"
      );
      expect(transformedRows[blankRaceRowIndex].split(",")[9]).toEqual(
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
