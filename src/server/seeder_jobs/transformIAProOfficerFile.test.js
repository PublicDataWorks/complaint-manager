const fs = require("fs");
const path = require("path");
const util = require("util");
const { transformIAProOfficerData } = require("./transformIAProOfficerFile");

describe("transformIAProOfficerFile", () => {
  test("parses correct headers with values", async () => {
    const iaProOfficerBufferedData = await readFile(
      "testIAProOfficerFile.correctHeaders.csv"
    );
    const transformedOfficerDataString = await transformIAProOfficerData(
      iaProOfficerBufferedData
    );
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
      "Not Applicab",
      "1/1/20 0:00",
      "MSB - Management Service Bureau",
      "First District",
      "2222",
      "Non-Commissioned",
      "1234"
    ]);
  });

  test("throws error if required headers are missing", async () => {
    const iaProOfficerBufferedData = await readFile(
      "testIAProOfficerFile.missingHeaders.csv"
    );
    await expect(
      transformIAProOfficerData(iaProOfficerBufferedData)
    ).rejects.toEqual(
      expect.objectContaining({ message: "Missing required header fields." })
    );
  });

  test("removes non-district values from division field", async () => {
    const iaProOfficerBufferedData = await readFile(
      "testIAProOfficerFile.correctHeaders.csv"
    );
    const transformedOfficerDataString = await transformIAProOfficerData(
      iaProOfficerBufferedData
    );
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
    const iaProOfficerBufferedData = await readFile(
      "testIAProOfficerFile.correctHeaders.csv"
    );
    const transformedOfficerDataString = await transformIAProOfficerData(
      iaProOfficerBufferedData
    );
    const rows = transformedOfficerDataString.split("\n");
    const nonCommisionedRow = rows[2].split(",");
    const comisionedRow = rows[3].split(",");
    expect(nonCommisionedRow[14]).toEqual("Non-Commissioned");
    expect(comisionedRow[14]).toEqual("Commissioned");
  });
});

const readFile = async filename => {
  const filePath = path.resolve(__dirname, filename);
  const promisifyReadFile = util.promisify(fs.readFile);
  return await promisifyReadFile(filePath);
};
