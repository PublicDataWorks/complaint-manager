import models from "../../../../policeDataManager/models";
import { createTestCaseWithCivilian } from "../../../../testHelpers/modelMothers";
import CaseStatus from "../../../../../sharedTestHelpers/caseStatus";
import getReferralLetterDataForResponse from "./getReferralLetterDataForResponse";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";

describe("getReferralLetterDataForResponse", () => {
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return the letter data and audit details", async () => {
    const expectedReferralLetterDataResponseAuditDetails = {
      referralLetter: {
        attributes: expect.toIncludeSameMembers([
          "id",
          "caseId",
          "includeRetaliationConcerns"
        ]),
        model: models.referral_letter.name
      },
      caseOfficers: {
        attributes: expect.toIncludeSameMembers([
          "id",
          "firstName",
          "middleName",
          "lastName",
          "fullName"
        ]),
        model: models.case_officer.name
      },
      letterOfficer: {
        attributes: expect.toIncludeSameMembers([
          "id",
          "caseOfficerId",
          "historicalBehaviorNotes",
          "numHistoricalHighAllegations",
          "numHistoricalMedAllegations",
          "numHistoricalLowAllegations",
          "recommendedActionNotes",
          "officerHistoryOptionId"
        ]),
        model: models.letter_officer.name
      },
      referralLetterOfficerRecommendedActions: {
        attributes: expect.toIncludeSameMembers([
          "recommendedActionId",
          "referralLetterOfficerId"
        ]),
        model: models.referral_letter_officer_recommended_action.name
      },
      referralLetterOfficerHistoryNotes: {
        attributes: expect.toIncludeSameMembers([
          "id",
          "referralLetterOfficerId",
          "pibCaseNumber",
          "details"
        ]),
        model: models.referral_letter_officer_history_note.name
      },
      caseClassification: {
        attributes: expect.arrayContaining([
          "id",
          "caseId",
          "classificationId"
        ]),
        model: models.case_classification.name
      }
    };

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
      const referralLetterDataAndAuditDetails =
        await getReferralLetterDataForResponse(existingCase.id, transaction);
      expect(referralLetterDataAndAuditDetails).toEqual({
        auditDetails: expectedReferralLetterDataResponseAuditDetails,
        referralLetterData: expect.anything()
      });
    });
  });
});
