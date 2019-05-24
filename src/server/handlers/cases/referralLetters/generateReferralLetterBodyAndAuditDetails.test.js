import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import models from "../../../models";
import { getReferralLetterCaseDataAndAuditDetails } from "./generateReferralLetterBodyAndAuditDetails";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "./generateReferralLetterBodyAndAuditDetails";

jest.mock("../../getQueryAuditAccessDetails");

jest.mock("handlebars", () => ({
  compile: jest.fn(() => {
    return caseData => {
      return caseData;
    };
  })
}));

describe("generateReferralLetterBodyAndAuditDetails", () => {
  let existingCase;

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("getReferralLetterCaseDataAndAuditDetails", () => {
    test("should return caseData and auditDetails", async () => {
      const referralLetterCaseDataAndAuditDetails = await models.sequelize.transaction(
        async transaction => {
          return await getReferralLetterCaseDataAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(referralLetterCaseDataAndAuditDetails).toEqual({
        caseData: expect.objectContaining({
          id: existingCase.id
        }),
        auditDetails: {
          cases: {
            attributes: ["mockDetails"],
            model: models.cases.name
          }
        }
      });
    });
  });

  describe("generateReferralLetterBodyAndAuditDetails", () => {
    test("should return an object with referralLetterBody and auditDetails", async () => {
      const referralLetterBodyAndAuditDetails = await models.sequelize.transaction(
        async transaction => {
          return await generateReferralLetterBodyAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(referralLetterBodyAndAuditDetails).toEqual({
        referralLetterBody: expect.anything(),
        auditDetails: {
          cases: {
            attributes: ["mockDetails"],
            model: models.cases.name
          }
        }
      });
    });
  });
});
