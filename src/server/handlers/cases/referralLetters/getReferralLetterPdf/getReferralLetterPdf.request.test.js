import fs from "fs";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import models from "../../../../policeDataManager/models";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import LetterOfficer from "../../../../testHelpers/LetterOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import app from "../../../../server";
import request from "supertest";
import {
  seedLetterSettings,
  seedStandardCaseStatuses
} from "../../../../testHelpers/testSeeding";

jest.mock(
  "../../../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("Generate referral letter pdf", () => {
  let existingCase, token, statuses;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await seedLetterSettings();
    token = buildTokenWithPermissions("", "some_nickname");

    statuses = await seedStandardCaseStatuses();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

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
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "test" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(3939)
        .withType("COMPLAINANT")
        .withDefaultSender(signerAttr)
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "test" }
    );

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withOfficerId(officer.id);
    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Letter in Progress")
          .id
      },
      { auditUser: "test" }
    );

    const letterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);
    await models.letter_officer.create(letterOfficerAttributes, {
      auditUser: "test"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient title and name")
      .withRecipientAddress("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    await models.referral_letter.create(referralLetterAttributes, {
      auditUser: "test"
    });
  });

  test("returns letter pdf blob", async () => {
    const responsePromise = request(app)
      .get(`/api/cases/${existingCase.id}/referral-letter/get-pdf`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const response = await expectResponse(
      responsePromise,
      200,
      expect.any(Buffer)
    );

    expect(response.body.length > 0).toBeTruthy();
  });
});
