import request from "supertest";
import app from "../../../../server";
import Case from "../../../../../client/testUtilities/case";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../../client/testUtilities/civilian";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";

jest.mock("./uploadLetterToS3", () => jest.fn());

describe("Approve referral letter", () => {
  let existingCase, token;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
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
      .withRecipient("recipient address")
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
        `${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`,
        "some_nickname"
      );
    });
    test("returns 200 when api endpoint hit", async () => {
      await request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/approve-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("user does not have permissions", () => {
    beforeEach(() => {
      token = buildTokenWithPermissions("", "some_nickname");
    });
    test(
      "returns 400 when api endpoint hit without permissions",
      suppressWinstonLogs(async () => {
        await request(app)
          .put(`/api/cases/${existingCase.id}/referral-letter/approve-letter`)
          .set("Content-Header", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .expect(400);
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
