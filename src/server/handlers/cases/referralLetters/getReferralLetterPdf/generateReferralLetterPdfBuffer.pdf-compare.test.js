import fs from "fs";
import generateReferralLetterPdfBuffer from "./generateReferralLetterPdfBuffer";
import models from "../../../../policeDataManager/models";
import { compareLetter } from "../sharedLetterUtilities/compareLetterPDFTestUtil";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import { ACCUSED, COMPLAINANT } from "../../../../../sharedUtilities/constants";
import Officer from "../../../../../sharedTestHelpers/Officer";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("Compare Generated Complainant Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    global.Date.now = jest.fn(() => 1530118207007);
  });

  test("src/testPDFs/referralLetter.pdf should match baseline (instance-files/tests/basePDFs/referralLetter.pdf); pngs saved in src/testPDFs", async () => {
    const letterCase = await models.cases.create(
      new Case.Builder().defaultCase().withId(1234).withCaseNumber("0001"),
      { auditUser: "user" }
    );

    const complainantOfficer = await models.officer.create(
      new Officer.Builder().defaultOfficer().withId(1).withOfficerNumber(39393)
    );

    const accusedOfficer = await models.officer.create(
      new Officer.Builder().defaultOfficer().withId(2).withOfficerNumber(38383)
    );

    const letterComplainant = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(1)
        .withOfficerId(complainantOfficer.id)
        .withCaseId(letterCase.id)
        .withRoleOnCase(COMPLAINANT),
      { auditUser: "user" }
    );

    const letterAccused = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(2)
        .withOfficerId(accusedOfficer.id)
        .withCaseId(letterCase.id)
        .withRoleOnCase(ACCUSED),
      { auditUser: "user" }
    );

    const referralLetter = await models.referral_letter.create(
      new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withCaseId(letterCase.id)
        .withSender("Blobby Loblaw")
        .withRecipient("Barry Zuckercorn")
        .withRecipientAddress("123 Main St."),
      { auditUser: "user" }
    );

    let { pdfBuffer } = await models.sequelize.transaction(
      async transaction =>
        await generateReferralLetterPdfBuffer(letterCase.id, true, transaction)
    );
    let file = process.cwd() + "/src/testPDFs/referralLetter.pdf";
    fs.writeFileSync(file, pdfBuffer);

    const result = await compareLetter("referralLetter.pdf");
    expect(result.status).toEqual("passed");
  });

  afterEach(async () => {
    global.Date.now = actualDateNow;
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
});
