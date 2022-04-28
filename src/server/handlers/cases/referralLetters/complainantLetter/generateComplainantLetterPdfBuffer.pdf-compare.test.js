import generateComplainantLetterPdfBuffer from "./generateComplainantLetterPdfBuffer";
import fs from "fs";
import { compareLetter } from "../sharedLetterUtilities/compareLetterPDFTestUtil";
import models from "../../../../policeDataManager/models";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("Compare Generated Complainant Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  beforeEach(async () => {
    await cleanupDatabase();

    global.Date.now = jest.fn(() => 1530118207007);
    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Stella Cziment")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("stella_cziment.png")
      .build();
    await models.sequelize.transaction(async transaction => {
      const signer = await models.signers.create(signerAttr, {
        auditUser: "user",
        transaction
      });
      const letterAttr = new LetterType.Builder()
        .defaultLetterType()
        .withType("COMPLAINANT")
        .withDefaultSender(signer)
        .build();
      await models.letter_types.create(letterAttr, {
        auditUser: "user",
        transaction
      });
    });
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

  afterEach(async () => {
    global.Date.now = actualDateNow;
    await cleanupDatabase();
  });
});
