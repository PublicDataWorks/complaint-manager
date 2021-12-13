import generateComplainantLetterPdfBuffer from "./generateComplainantLetterPdfBuffer";
import fs from "fs";
import { compareLetter } from "../sharedLetterUtilities/compareLetterPDFTestUtil";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("Compare Generated Complainant Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    global.Date.now = jest.fn(() => 1530118207007);
  });

  test("src/testPDFs/complainantLetter.pdf should match baseline (instance-files/tests/basePDFs/complainantLetter.pdf); pngs saved in src/testPDFs", async () => {
    const existingCase = {
      caseReference: "CN-202393",
      firstContactDate: "2020-01-01"
    };

    const complainant = {
      civilianTitle: {
        name: "Bobby"
      },
      firstName: "Bob",
      lastName: "Loblaw",
      address: "123 Loblaw Lane",
      email: "bob@bobloblawslawblog.net",
      officerId: "9393448",
      caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
    };

    let buffer = await generateComplainantLetterPdfBuffer(
      existingCase,
      complainant
    );
    let file = process.cwd() + "/src/testPDFs/complainantLetter.pdf";
    fs.writeFileSync(file, buffer);

    const result = await compareLetter("complainantLetter.pdf");
    expect(result.status).toEqual("passed");
  });

  afterEach(() => {
    global.Date.now = actualDateNow;
  });
});
