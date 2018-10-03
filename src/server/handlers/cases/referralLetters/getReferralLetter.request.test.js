import models from "../../../models";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";
import request from "supertest";
import app from "../../../server";
import Case from "../../../../client/testUtilities/case";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";

describe("GET /cases/:id/referral-letter", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it should get referral letter data", async () => {
    const token = buildTokenWithPermissions("", "some_nickname");
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    const newCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(newCase.id);
    const referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );

    const expectedResponse = {
      id: referralLetter.id,
      referralLetterOfficers: []
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
});
