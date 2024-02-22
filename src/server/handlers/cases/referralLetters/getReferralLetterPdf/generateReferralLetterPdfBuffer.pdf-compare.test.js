import fs from "fs";
import models from "../../../../policeDataManager/models";
import { compareLetter } from "../sharedLetterUtilities/compareLetterPDFTestUtil";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../../sharedTestHelpers/caseStatus";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import { ACCUSED, COMPLAINANT } from "../../../../../sharedUtilities/constants";
import Officer from "../../../../../sharedTestHelpers/Officer";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import LetterTypeLetterImage from "../../../../../sharedTestHelpers/LetterTypeLetterImage";
import LetterImage from "../../../../../sharedTestHelpers/LetterImage";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import { retrieveSignatureImageBySigner } from "../retrieveSignatureImage";
import {
  seedLetterSettings,
  seedPersonTypes
} from "../../../../testHelpers/testSeeding";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

const mockS3 = {
  getObject: jest.fn()
};

jest.mock("../../../../createConfiguredS3Instance", () =>
  jest.fn(() => mockS3)
);

describe("Compare Generated Referral Letter to Baseline", () => {
  const actualDateNow = Date.now.bind(global.Date);
  let personTypes;
  beforeEach(async () => {
    await cleanupDatabase();
    await seedLetterSettings();
    personTypes = await seedPersonTypes();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    global.Date.now = jest.fn(() => 1708369556089);

    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Nina Ambroise")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("nina_ambroise.png")
      .build();
    const signer = await models.signers.create(signerAttr, {
      auditUser: "user"
    });

    const referralLetterTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
    );

    const letterBodyTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`
    );
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withEditableTemplate(letterBodyTemplate.toString())
        .withType("REFERRAL")
        .withTemplate(referralLetterTemplate.toString())
        .withDefaultSender(signerAttr)
        .build(),
      { auditUser: "test" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(389784)
        .withType("COMPLAINANT")
        .withDefaultSender(signerAttr)
        .build(),
      { auditUser: "test" }
    );

    const image1 = await models.letterImage.create(
      new LetterImage.Builder().defaultLetterImage().build(),
      { auditUser: "user" }
    );

    const image2 = await models.letterImage.create(
      new LetterImage.Builder()
        .defaultLetterImage()
        .withId(2)
        .withImage("icon.png")
        .build(),
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .withImageId(image1.id)
        .build(),
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .withId(2)
        .withImageId(image2.id)
        .withMaxWidth("60px")
        .withName("smallIcon")
        .build(),
      { auditUser: "user" }
    );

    mockS3.getObject.mockImplementation((opts, callback) =>
      callback(undefined, {
        ContentType: "image/png",
        Body: {
          transformToString: () =>
            fs.readFileSync(
              process.cwd() + `/localstack-seed-files/${opts.Key}`,
              "base64"
            )
        }
      })
    );
  });

  test("src/testPDFs/referralLetter2024.pdf should match baseline (instance-files/tests/basePDFs/referralLetter2024.pdf); pngs saved in src/testPDFs", async () => {
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
        .withRoleOnCase(COMPLAINANT)
        .withPersonTypeKey(personTypes[1].key),
      { auditUser: "user" }
    );

    const letterAccused = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(2)
        .withOfficerId(accusedOfficer.id)
        .withCaseId(letterCase.id)
        .withRoleOnCase(ACCUSED)
        .withPersonTypeKey(personTypes[1].key),
      { auditUser: "user" }
    );

    const referralLetter = await models.referral_letter.create(
      new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withCaseId(letterCase.id)
        .withSender("Stella Cziment")
        .withRecipient("Deputy Superintendent Keith Sanchez")
        .withRecipientAddress(`Public Integrity Bureau
        New Orleans Police Department
        1340 Poydras St Suite 1900
        New Orleans, LA 70112`),
      { auditUser: "user" }
    );

    let { pdfBuffer } = await models.sequelize.transaction(
      async transaction =>
        await generateLetterPdfBuffer(letterCase.id, true, transaction, {
          getSignature: async args => {
            return await retrieveSignatureImageBySigner(args.sender);
          },
          type: "REFERRAL"
        })
    );
    let file = process.cwd() + "/src/testPDFs/referralLetter2024.pdf";
    fs.writeFileSync(file, pdfBuffer);

    const result = await compareLetter("referralLetter2024.pdf");
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
