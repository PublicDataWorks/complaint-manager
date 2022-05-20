import request from "supertest";
import app from "../../../../server";
import Case from "../../../../../sharedTestHelpers/case";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  USER_PERMISSIONS
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
import { authEnabledTest } from "../../../../testHelpers/authEnabledTest";

jest.mock("../sharedLetterUtilities/uploadLetterToS3", () => jest.fn());

describe("Approve referral letter", () => {
  let existingCase, token;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    token = buildTokenWithPermissions("letter:setup", "some_nickname");
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
      .withRoleOnCase(COMPLAINANT);

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(complainantOfficer.id)
      .withRoleOnCase(COMPLAINANT);

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplaintType(CIVILIAN_INITIATED)
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
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "nickname" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "nickname" }
    );
    await existingCase.update(
      { status: CASE_STATUS.READY_FOR_REVIEW },
      { auditUser: "nickname" }
    );
  };
});
