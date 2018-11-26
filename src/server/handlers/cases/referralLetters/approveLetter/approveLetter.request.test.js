import request from "supertest";
import app from "../../../../server";
import Case from "../../../../../client/testUtilities/case";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import {buildTokenWithPermissions} from "../../../../testHelpers/requestTestHelpers";

jest.mock("./uploadLetterToS3", () => jest.fn());

describe("Approve referral letter", () => {
  let existingCase, token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
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

    const referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );
  });

  test("returns 200 when api endpoint hit", async () => {
    await request(app)
      .put(`/api/cases/${existingCase.id}/referral-letter/approve-letter`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
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
