import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import models from "../../../policeDataManager/models";
import {
  generateReferralLetterBodyAndAuditDetails,
  getReferralLetterCaseDataAndAuditDetails
} from "./generateReferralLetterBodyAndAuditDetails";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import {
  COMPLAINANT,
  RANK_INITIATED
} from "../../../../sharedUtilities/constants";
import Officer from "../../../../sharedTestHelpers/Officer";

const {
  CIVILIAN_WITHIN_PD_INITIATED,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

jest.mock("handlebars", () => ({
  compile: jest.fn(() => {
    return caseData => {
      return caseData;
    };
  })
}));

describe("generateReferralLetterBodyAndAuditDetails", () => {
  let existingCase, officer;

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
    officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "auditUser" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("getReferralLetterCaseDataAndAuditDetails", () => {
    test("should return caseData and auditDetails", async () => {
      const referralLetterCaseDataAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getReferralLetterCaseDataAndAuditDetails(
            existingCase.id,
            transaction
          );
        });

      let caseReferenceSuffix = existingCase.caseNumber + "";
      caseReferenceSuffix = caseReferenceSuffix.padStart(4, "0");
      expect(referralLetterCaseDataAndAuditDetails).toEqual({
        caseData: expect.objectContaining({
          id: existingCase.id,
          caseReference: `${PERSON_TYPE.CIVILIAN.abbreviation}2017-${caseReferenceSuffix}`,
          caseReferencePrefix: PERSON_TYPE.CIVILIAN.abbreviation
        }),
        auditDetails: expectedReferralLetterCaseAuditDetails
      });
    });

    test("should return caseData and auditDetails for Civilian Within PD", async () => {
      let cpdCase = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withComplaintType(CIVILIAN_WITHIN_PD_INITIATED),
        { auditUser: "nobody" }
      );

      await models.case_officer.create(
        new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withCaseEmployeeType(
            PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
          )
          .withCaseId(cpdCase.id)
          .withRoleOnCase(COMPLAINANT)
          .withOfficerId(officer.id),
        { auditUser: "auditUser" }
      );

      const referralLetterCaseDataAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getReferralLetterCaseDataAndAuditDetails(
            cpdCase.id,
            transaction
          );
        });

      let caseReferenceSuffix = cpdCase.caseNumber + "";
      caseReferenceSuffix = caseReferenceSuffix.padStart(4, "0");
      expect(referralLetterCaseDataAndAuditDetails).toEqual({
        caseData: expect.objectContaining({
          id: cpdCase.id,
          caseReference: `${PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation}2017-${caseReferenceSuffix}`,
          caseReferencePrefix: PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation
        }),
        auditDetails: expectedReferralLetterCaseAuditDetails
      });
    });

    test("should return caseData and auditDetails for Police Officer", async () => {
      let poCase = await models.cases.create(
        new Case.Builder().defaultCase().withComplaintType(RANK_INITIATED),
        { auditUser: "nobody" }
      );

      await models.case_officer.create(
        new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withCaseId(poCase.id)
          .withRoleOnCase(COMPLAINANT)
          .withOfficerId(officer.id),
        { auditUser: "auditUser" }
      );

      const referralLetterCaseDataAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getReferralLetterCaseDataAndAuditDetails(
            poCase.id,
            transaction
          );
        });

      let caseReferenceSuffix = poCase.caseNumber + "";
      caseReferenceSuffix = caseReferenceSuffix.padStart(4, "0");
      expect(referralLetterCaseDataAndAuditDetails).toEqual({
        caseData: expect.objectContaining({
          id: poCase.id,
          caseReference: `${PERSON_TYPE.KNOWN_OFFICER.abbreviation}2017-${caseReferenceSuffix}`,
          caseReferencePrefix: PERSON_TYPE.KNOWN_OFFICER.abbreviation
        }),
        auditDetails: expectedReferralLetterCaseAuditDetails
      });
    });

    test("should return caseData and auditDetails for Anonymous", async () => {
      let acCase = await models.cases.create(
        new Case.Builder().defaultCase().withComplaintType(RANK_INITIATED),
        { auditUser: "nobody" }
      );

      await models.case_officer.create(
        new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withIsAnonymous(true)
          .withRoleOnCase(COMPLAINANT)
          .withCaseId(acCase.id)
          .withOfficerId(officer.id),
        { auditUser: "auditUser" }
      );

      const referralLetterCaseDataAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getReferralLetterCaseDataAndAuditDetails(
            acCase.id,
            transaction
          );
        });

      let caseReferenceSuffix = acCase.caseNumber + "";
      caseReferenceSuffix = caseReferenceSuffix.padStart(4, "0");
      expect(referralLetterCaseDataAndAuditDetails).toEqual({
        caseData: expect.objectContaining({
          id: acCase.id,
          caseReference: `AC2017-${caseReferenceSuffix}`,
          caseReferencePrefix: "AC"
        }),
        auditDetails: expectedReferralLetterCaseAuditDetails
      });
    });
  });

  describe("generateReferralLetterBodyAndAuditDetails", () => {
    test("should return an object with referralLetterBody and auditDetails", async () => {
      const referralLetterBodyAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await generateReferralLetterBodyAndAuditDetails(
            existingCase.id,
            transaction
          );
        });

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
