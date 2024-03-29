import request from "supertest";
import fs from "fs";
import app from "../../../../server";
import Case from "../../../../../sharedTestHelpers/case";
import {
  CIVILIAN_INITIATED,
  COMPLAINANT
} from "../../../../../sharedUtilities/constants";
import models from "../../../../policeDataManager/models";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Signer from "../../../../../sharedTestHelpers/signer";
import LetterType from "../../../../../sharedTestHelpers/letterType";
import { authEnabledTest } from "../../../../testHelpers/authEnabledTest";
import {
  seedLetterSettings,
  seedPersonTypes,
  seedStandardCaseStatuses
} from "../../../../testHelpers/testSeeding";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

jest.mock("../sharedLetterUtilities/uploadLetterToS3", () => jest.fn());

jest.mock("../../../../createConfiguredS3Instance");

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

let s3 = createConfiguredS3Instance();
s3.getObject.mockImplementation((opts, callback) =>
  callback(undefined, {
    ContentType: "image/png",
    Body: fs
      .readFileSync(
        process.cwd() + "/localstack-seed-files/signatures/nina_ambroise.png",
        "base64"
      )
      .toString()
  })
);

describe("Approve referral letter", () => {
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
    const personTypes = await seedPersonTypes();
    token = buildTokenWithPermissions("letter:setup", "some_nickname");

    statuses = await seedStandardCaseStatuses();

    const signerAttr = new Signer.Builder()
      .defaultSigner()
      .withName("Nina Ambroise")
      .withTitle("Acting Police Monitor")
      .withSignatureFile("stella_cziment.png")
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

    const complainantLetterTemplate = fs.readFileSync(
      `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(88373)
        .withType("COMPLAINANT")
        .withTemplate(complainantLetterTemplate.toString())
        .withDefaultSender(signerAttr)
        .withRequiredStatus(statuses[0])
        .build(),
      { auditUser: "test" }
    );

    const complainantOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const complainantOfficer = await models.officer.create(
      complainantOfficerAttributes,
      { auditUser: "test" }
    );

    const complainantCivilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withPersonType(personTypes[2].key)
      .withRoleOnCase(COMPLAINANT);

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(complainantOfficer.id)
      .withRoleOnCase(COMPLAINANT)
      .withPersonTypeKey(personTypes[1].key);

    const complaintType = await models.complaintTypes.create({
      name: CIVILIAN_INITIATED
    });

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplaintTypeId(complaintType.id)
      .withIncidentDate("2003-01-01")
      .withFirstContactDate("2004-01-01")
      .withComplainantCivilians([complainantCivilianAttributes])
      .withComplainantOfficers([complainantCaseOfficerAttributes]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    await elevateCaseStatusToReadyForReview(existingCase);

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

  describe("user has permissions", () => {
    beforeEach(() => {
      token = buildTokenWithPermissions(
        "update:case-status letter:setup",
        "some_nickname"
      );
    });

    test("returns 200 when api endpoint hit", async () => {
      const responsePromise = request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/approve-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);
    });
  });

  describe("user does not have permissions", () => {
    const test = authEnabledTest();
    beforeEach(() => {
      token = buildTokenWithPermissions("", "some_nickname");
    });

    test(
      "returns 403 when api endpoint hit without permissions",
      suppressWinstonLogs(async () => {
        const responsePromise = request(app)
          .put(`/api/cases/${existingCase.id}/referral-letter/approve-letter`)
          .set("Content-Header", "application/json")
          .set("Authorization", `Bearer ${token}`);

        await expectResponse(responsePromise, 403);
      })
    );
  });

  const elevateCaseStatusToReadyForReview = async existingCase => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Ready for Review").id
      },
      { auditUser: "nickname" }
    );
  };
});
