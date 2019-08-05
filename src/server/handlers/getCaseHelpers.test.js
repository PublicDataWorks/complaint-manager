import Case from "../../client/testUtilities/case";
import {
  addFieldsToCaseDetails,
  getCaseWithAllAssociationsAndAuditDetails,
  getCaseWithoutAssociations
} from "./getCaseHelpers";
import models from "../models";
import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import Officer from "../../client/testUtilities/Officer";
import { ACCUSED, COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";
import Civilian from "../../client/testUtilities/civilian";

describe("getCaseHelpers", () => {
  let existingCase, referralLetter, auditDetails;
  beforeEach(async () => {
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withCaseId(existingCase.id)
      .withId(undefined);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "someone"
      }
    );

    auditDetails = {};
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("getCaseWithAllAssocationsAndAuditDetails", () => {
    test("adds pdfAvailable to audit", async () => {
      const caseWithAssociationsAndAuditDetails = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(caseWithAssociationsAndAuditDetails.auditDetails).toEqual(
        expect.objectContaining({
          cases: expect.objectContaining({
            attributes: expect.arrayContaining(["pdfAvailable"])
          })
        })
      );
    });

    test("adds isArchived to audit and removes deletedAt", async () => {
      const caseWithAssociationsAndAuditDetails = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );
      const caseAuditDetails = caseWithAssociationsAndAuditDetails.auditDetails;
      expect(
        caseAuditDetails.cases.attributes.includes("isArchived")
      ).toBeTruthy();
      expect(
        caseAuditDetails.cases.attributes.includes("deletedAt")
      ).toBeFalsy();
    });

    test("adds pdfAvailable as true if there is a pdf file name on the referral letter", async () => {
      await referralLetter.update(
        { finalPdfFilename: "something.pdf" },
        { auditUser: "someone" }
      );
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );
      expect(caseDetails.pdfAvailable).toEqual(true);
      expect(caseDetails.referralLetter).toBeUndefined();
    });
    test("adds pdfAvailable as false if there is not a pdf file name on the referral letter", async () => {
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );
      expect(caseDetails.pdfAvailable).toEqual(false);
      expect(caseDetails.referralLetter).toBeUndefined();
    });
    test("returns accusedOfficers in ascending order of their createdAt date", async () => {
      await createUnknownAccusedCaseOfficer(
        existingCase,
        new Date("2018-08-01")
      );
      await createCaseOfficer(
        existingCase,
        ACCUSED,
        912,
        new Date("2018-01-01")
      );

      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(
        caseDetails.accusedOfficers[0].createdAt <
          caseDetails.accusedOfficers[1].createdAt
      ).toEqual(true);
    });
    test("returns complainants in ascending order of their createdAt date", async () => {
      await createCaseOfficer(
        existingCase,
        COMPLAINANT,
        234,
        new Date("2018-08-01")
      );
      await createCaseOfficer(
        existingCase,
        COMPLAINANT,
        123,
        new Date("2018-01-01")
      );
      await createCivilian(existingCase, COMPLAINANT, new Date("2018-08-01"));
      await createCivilian(existingCase, COMPLAINANT, new Date("2018-01-01"));

      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(
        caseDetails.complainantOfficers[0].createdAt <
          caseDetails.complainantOfficers[1].createdAt
      ).toEqual(true);
      expect(
        caseDetails.complainantCivilians[0].createdAt <
          caseDetails.complainantCivilians[1].createdAt
      ).toEqual(true);
    });

    test("returns witnesses in ascending order of their createdAt date", async () => {
      await createCaseOfficer(
        existingCase,
        WITNESS,
        234,
        new Date("2018-08-01")
      );
      await createCaseOfficer(
        existingCase,
        WITNESS,
        123,
        new Date("2018-01-01")
      );
      await createCivilian(existingCase, WITNESS, new Date("2018-01-01"));
      await createCivilian(existingCase, WITNESS, new Date("2018-08-01"));

      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(
        caseDetails.witnessOfficers[0].createdAt <
          caseDetails.witnessOfficers[1].createdAt
      ).toEqual(true);
      expect(
        caseDetails.witnessCivilians[0].createdAt <
          caseDetails.witnessCivilians[1].createdAt
      ).toEqual(true);
    });

    test("returns archived case with isArchived set and all associations", async () => {
      await models.cases.destroy({
        where: { id: existingCase.id },
        auditUser: "test"
      });
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction
          );
        }
      );

      expect(caseDetails.isArchived).toBeTruthy();
    });
  });

  describe("addFieldsToCaseDetails", () => {
    test("should return updated caseDetails and auditDetails", () => {
      const caseDetails = {
        deletedAt: null
      };

      const auditDetails = {
        cases: {
          attributes: [],
          model: models.cases.name
        }
      };

      const caseDetailsAndAuditDetails = addFieldsToCaseDetails(
        caseDetails,
        auditDetails
      );

      expect(caseDetailsAndAuditDetails).toEqual({
        caseDetails: {
          isArchived: false,
          pdfAvailable: false
        },
        auditDetails: {
          cases: {
            attributes: ["pdfAvailable", "isArchived"],
            model: models.cases.name
          }
        }
      });
    });
  });

  describe("getCaseWithoutAssociations", async () => {
    test("returns archived case with isArchived set", async () => {
      await models.cases.destroy({
        where: { id: existingCase.id },
        auditUser: "test"
      });
      const caseWithoutAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithoutAssociations(existingCase.id, transaction);
        }
      );

      expect(caseWithoutAssociations.isArchived).toBeTruthy();
    });
  });
});

async function createCaseOfficer(
  existingCase,
  role,
  officerNumber,
  dateCreated
) {
  const officerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withOfficerNumber(officerNumber)
    .withId(undefined);

  const officer = await models.officer.create(officerAttributes, {
    auditUser: "someone"
  });

  const caseOfficerAttributes = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withId(undefined)
    .withOfficerId(officer.id)
    .withCaseId(existingCase.id)
    .withRoleOnCase(role)
    .withCreatedAt(dateCreated);

  await models.case_officer.create(caseOfficerAttributes, {
    auditUser: "someone"
  });
}

const createUnknownAccusedCaseOfficer = async (existingCase, dateCreated) => {
  const unknownCaseOfficerAttributes = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withUnknownOfficer()
    .withCaseId(existingCase.id)
    .withCreatedAt(dateCreated);

  await models.case_officer.create(unknownCaseOfficerAttributes, {
    auditUser: "someone"
  });
};

const createCivilian = async (existingCase, role, dateCreated) => {
  const civilianAttributes = new Civilian.Builder()
    .defaultCivilian()
    .withCaseId(existingCase.id)
    .withId(undefined)
    .withRoleOnCase(role)
    .withCreatedAt(dateCreated);

  await models.civilian.create(civilianAttributes, {
    auditUser: "someone"
  });
};
