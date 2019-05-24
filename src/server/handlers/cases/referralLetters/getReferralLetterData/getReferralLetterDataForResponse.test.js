import models from "../../../../models";
import { createTestCaseWithCivilian } from "../../../../testHelpers/modelMothers";
import getReferralLetterDataForResponse from "./getReferralLetterDataForResponse";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";

jest.mock("../../../getQueryAuditAccessDetails");

describe("getReferralLetterDataForResponse", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  test("should return the letter data and audit details", async () => {
    const existingCase = await createTestCaseWithCivilian();
    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withIncludeRetaliationConcerns(true)
      .withCaseId(existingCase.id);
    await models.referral_letter.create(referralLetterAttributes, {
      auditUser: "test"
    });
    await models.sequelize.transaction(async transaction => {
      const referralLetterDataAndAuditDetails = await getReferralLetterDataForResponse(
        existingCase.id,
        transaction
      );
      expect(referralLetterDataAndAuditDetails).toEqual({
        auditDetails: {
          mockAssociation: {
            attributes: ["mockDetails"],
            model: "mockModelName"
          }
        },
        referralLetterData: expect.anything()
      });
    });
  });
});
