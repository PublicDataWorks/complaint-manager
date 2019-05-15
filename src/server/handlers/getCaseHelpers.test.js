import Case from "../../client/testUtilities/case";
import {
  getCaseWithAllAssociations,
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
  describe("getCaseWithAllAssocations", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    test("doesn't remove existing referralLetter audit details", async () => {
      let auditDetails = {
        referralLetter: {
          attributes: ["attribute"]
        }
      };

      let caseWithAllAssociations;
      await models.sequelize.transaction(async transaction => {
        caseWithAllAssociations = await getCaseWithAllAssociations(
          existingCase.id,
          transaction,
          auditDetails
        );
      });

      expect(auditDetails).toEqual(
        expect.objectContaining({
          referralLetter: {
            attributes: ["attribute"]
          }
        })
      );
    });

    test("adds pdfAvailable to audit", async () => {
      await models.sequelize.transaction(async transaction => {
        await getCaseWithAllAssociations(
          existingCase.id,
          transaction,
          auditDetails
        );
      });
      expect(
        auditDetails.cases.attributes.includes("pdfAvailable")
      ).toBeTruthy();
    });

    test("adds isArchived to audit and removes deletedAt", async () => {
      await models.sequelize.transaction(async transaction => {
        await getCaseWithAllAssociations(
          existingCase.id,
          transaction,
          auditDetails
        );
      });
      expect(auditDetails.cases.attributes.includes("isArchived")).toBeTruthy();
      expect(auditDetails.cases.attributes.includes("deletedAt")).toBeFalsy();
    });

    test("adds pdfAvailable as true if there is a pdf file name on the referral letter", async () => {
      await referralLetter.update(
        { finalPdfFilename: "something.pdf" },
        { auditUser: "someone" }
      );
      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );
      expect(caseWithAllAssociations.pdfAvailable).toEqual(true);
      expect(caseWithAllAssociations.referralLetter).toBeUndefined();
    });
    test("adds pdfAvailable as false if there is not a pdf file name on the referral letter", async () => {
      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );
      expect(caseWithAllAssociations.pdfAvailable).toEqual(false);
      expect(caseWithAllAssociations.referralLetter).toBeUndefined();
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

      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );

      expect(
        caseWithAllAssociations.accusedOfficers[0].createdAt <
          caseWithAllAssociations.accusedOfficers[1].createdAt
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

      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );

      expect(
        caseWithAllAssociations.complainantOfficers[0].createdAt <
          caseWithAllAssociations.complainantOfficers[1].createdAt
      ).toEqual(true);
      expect(
        caseWithAllAssociations.complainantCivilians[0].createdAt <
          caseWithAllAssociations.complainantCivilians[1].createdAt
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

      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );

      expect(
        caseWithAllAssociations.witnessOfficers[0].createdAt <
          caseWithAllAssociations.witnessOfficers[1].createdAt
      ).toEqual(true);
      expect(
        caseWithAllAssociations.witnessCivilians[0].createdAt <
          caseWithAllAssociations.witnessCivilians[1].createdAt
      ).toEqual(true);
    });

    test("returns archived case with isArchived set and all associations", async () => {
      await models.cases.destroy({
        where: { id: existingCase.id },
        auditUser: "test"
      });
      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );

      expect(caseWithAllAssociations.isArchived).toBeTruthy();
    });
  });

  describe("getCaseWithoutAssociations", async () => {
    test("returns archived case with isArchived set", async () => {
      await models.cases.destroy({
        where: { id: existingCase.id },
        auditUser: "test"
      });
      const caseWithAllAssociations = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociations(
            existingCase.id,
            transaction,
            auditDetails
          );
        }
      );

      expect(caseWithAllAssociations.isArchived).toBeTruthy();
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
