import models from "../../../../models/index";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import request from "supertest";
import app from "../../../../server";
import Case from "../../../../../client/testUtilities/case";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
jest.mock("shortid", () => ({ generate: () => "uniqueTempId" }));

describe("GET /cases/:id/referral-letter", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  let token, newCase;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    newCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    await newCase.update({ status: CASE_STATUS.ACTIVE }, { auditUser: "test" });
  });

  describe("case is letter in progress", () => {
    let referralLetter;
    beforeEach(async () => {
      await newCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );

      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(newCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "test" }
      );
    });

    test("it should get referral letter data", async () => {
      const expectedResponse = {
        id: referralLetter.id,
        caseId: newCase.id,
        letterOfficers: [],
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        referralLetterIAProCorrections: [
          { tempId: "uniqueTempId" },
          { tempId: "uniqueTempId" },
          { tempId: "uniqueTempId" }
        ]
      };

      await request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(expectedResponse);
        });
    });

    test("it returns 200 if case status is ready for review", async () => {
      await newCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );
      await request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("it returns 200 if case status is forwarded to agency", async () => {
      await newCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      await newCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );
      await newCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "test" }
      );

      await request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("it returns 200 if case status is forwarded to agency", async () => {
      await newCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      await newCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );
      await newCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "test" }
      );
      await newCase.update(
        { status: CASE_STATUS.CLOSED },
        { auditUser: "test" }
      );

      await request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });

  test(
    "it returns 400 invalid case status message if case status is prior to letter in progress",
    suppressWinstonLogs(async () => {
      await request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
        .then(response => {
          expect(response.body.message).toEqual("Invalid case status");
        });
    })
  );
});
