import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import models from "../../../policeDataManager/models";
import {
  generateReferralLetterBodyAndAuditDetails,
  getReferralLetterCaseDataAndAuditDetails
} from "./generateReferralLetterBodyAndAuditDetails";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

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
        auditDetails: expectedReferralLetterCaseAuditDetails
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
        auditDetails: expectedReferralLetterCaseAuditDetails
      });
    });
  });
});

const expectedReferralLetterCaseAuditDetails = {
  cases: {
    attributes: expect.toIncludeSameMembers([
      "id",
      "incidentDate",
      "incidentTime",
      "narrativeDetails",
      "firstContactDate",
      "complaintType",
      "year",
      "caseNumber",
      "caseReference",
      "pibCaseNumber"
    ]),
    model: models.cases.name
  },
  referralLetter: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.referral_letter.rawAttributes)
    ),
    model: models.referral_letter.name
  },
  caseClassifications: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_classification.rawAttributes)
    ),
    model: models.case_classification.name
  },
  classification: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.classification.rawAttributes)
    ),
    model: models.classification.name
  },
  incidentLocation: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  complainantCivilians: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  address: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  raceEthnicity: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.race_ethnicity.rawAttributes)
    ),
    model: models.race_ethnicity.name
  },
  genderIdentity: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.gender_identity.rawAttributes)
    ),
    model: models.gender_identity.name
  },
  witnessCivilians: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  complainantOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  accusedOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  allegations: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.officer_allegation.rawAttributes)
    ),
    model: models.officer_allegation.name
  },
  allegation: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.allegation.rawAttributes)
    ),
    model: models.allegation.name
  },
  letterOfficer: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.letter_officer.rawAttributes)
    ),
    model: models.letter_officer.name
  },
  referralLetterOfficerHistoryNotes: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.referral_letter_officer_history_note.rawAttributes)
    ),
    model: models.referral_letter_officer_history_note.name
  },
  referralLetterOfficerRecommendedActions: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(
        models.referral_letter_officer_recommended_action.rawAttributes
      )
    ),
    model: models.referral_letter_officer_recommended_action.name
  },
  recommendedAction: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.recommended_action.rawAttributes)
    ),
    model: models.recommended_action.name
  },
  witnessOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  }
};
