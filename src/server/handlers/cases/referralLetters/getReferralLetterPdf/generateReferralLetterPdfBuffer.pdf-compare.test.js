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
import Signer from "../../../../../sharedTestHelpers/signer";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

describe("Compare Generated Referral Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  beforeEach(async () => {
    global.Date.now = jest.fn(() => 1530118207007);

    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Nina Ambroise")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("nina_ambroise.png")
      .build();
    await models.sequelize.transaction(async transaction => {
      const signer = await models.signers.create(signerAttr, {
        auditUser: "user",
        transaction
      });
    });

    let s3 = AWS.S3.mockImplementation(() => ({
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      getObject: jest.fn((opts, callback) =>
        callback(undefined, {
          ContentType: "image/png",
          Body: {
            toString: () =>
              fs.readFileSync(
                process.cwd() + "/localstack-seed-files/nina_s_ambroise.png",
                "base64"
              )
          }
        })
      )
    }));
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
        .withSender("Nina Ambroise")
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
