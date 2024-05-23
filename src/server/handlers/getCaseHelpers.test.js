import Case from "../../sharedTestHelpers/case";
import {
  addFieldsToCaseDetails,
  getCaseWithAllAssociationsAndAuditDetails,
  getCaseWithoutAssociations
} from "./getCaseHelpers";
import models from "../policeDataManager/models";
import ReferralLetter from "../testHelpers/ReferralLetter";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import Officer from "../../sharedTestHelpers/Officer";
import Civilian from "../../sharedTestHelpers/civilian";
import CaseStatus from "../../sharedTestHelpers/caseStatus";
import CaseInmate from "../../sharedTestHelpers/CaseInmate";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  COMPLAINANT,
  USER_PERMISSIONS,
  WITNESS
} from "../../sharedUtilities/constants";
import Attachment from "../../sharedTestHelpers/attachment";
import { seedPersonTypes } from "../testHelpers/testSeeding";
import Address from "../../sharedTestHelpers/Address";

describe("getCaseHelpers", () => {
  let existingCase, referralLetter, auditDetails;
  beforeEach(async () => {
    await cleanupDatabase();
    await seedPersonTypes();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });

    await models.attachment.create(
      new Attachment.Builder().defaultAttachment().withCaseId(existingCase.id),
      { auditUser: "someone" }
    );

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

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("without permission", () => {
    test("should not see an anonymous civilian's data", async () => {
      const genderIdentity = await models.gender_identity.create(
        { name: "Trans Woman" },
        { auditUser: "user" }
      );
      const raceEthnicity = await models.race_ethnicity.create(
        { name: "Native Hawaiian" },
        { auditUser: "user" }
      );
      const civilian = await createAnonymousCivilian(
        existingCase,
        COMPLAINANT,
        new Date("2018-01-01"),
        genderIdentity.id,
        raceEthnicity.id
      );

      await models.address.create(
        new Address.Builder()
          .defaultAddress()
          .withAddressableId(civilian.id)
          .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN),
        { auditUser: "user" }
      );

      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.MANAGE_TAGS
          );
        }
      );

      expect(caseDetails.complainantCivilians[0].firstName).toEqual(
        "Anonymous"
      );
      expect(caseDetails.complainantCivilians[0].middleInitial).toEqual("");
      expect(caseDetails.complainantCivilians[0].lastName).toEqual("");
      expect(caseDetails.complainantCivilians[0].suffix).toEqual("");
      expect(caseDetails.complainantCivilians[0].fullName).toEqual("Anonymous");
      expect(caseDetails.complainantCivilians[0].birthDate).toEqual("");
      expect(caseDetails.complainantCivilians[0].phoneNumber).toEqual("");
      expect(caseDetails.complainantCivilians[0].email).toEqual("");
      expect(caseDetails.complainantCivilians[0].additionalInfo).toEqual("");
      expect(caseDetails.complainantCivilians[0].address).toEqual(null);
      expect(caseDetails.complainantCivilians[0].raceEthnicity.id).toEqual(
        null
      );
      expect(caseDetails.complainantCivilians[0].raceEthnicity.name).toEqual(
        null
      );
      expect(caseDetails.complainantCivilians[0].raceEthnicityId).toEqual(null);
      expect(caseDetails.complainantCivilians[0].genderIdentity.id).toEqual(
        null
      );
      expect(caseDetails.complainantCivilians[0].genderIdentity.name).toEqual(
        null
      );
      expect(caseDetails.complainantCivilians[0].genderIdentityId).toEqual(
        null
      );
      expect(caseDetails.attachments).toEqual([]);
    });

    test("should see unknown for anonymous unknown civillians", async () => {
      await createAnonymousUnknownCivilian(
        existingCase,
        COMPLAINANT,
        new Date("2018-01-01")
      );
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.MANAGE_TAGS
          );
        }
      );

      expect(caseDetails.complainantCivilians[0].firstName).toEqual("");
    });

    test("should not see an anonymous officer's data", async () => {
      await createAnonymousCaseOfficer(
        existingCase,
        101,
        COMPLAINANT,
        new Date("2018-01-01")
      );
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.MANAGE_TAGS
          );
        }
      );

      expect(caseDetails.complainantOfficers[0].officerId).toEqual("");
      expect(caseDetails.complainantOfficers[0].firstName).toEqual("Anonymous");
      expect(caseDetails.complainantOfficers[0].middleName).toEqual("");
      expect(caseDetails.complainantOfficers[0].lastName).toEqual("");
      expect(caseDetails.complainantOfficers[0].fullName).toEqual("Anonymous");
      expect(caseDetails.complainantOfficers[0].phoneNumber).toEqual("");
      expect(caseDetails.complainantOfficers[0].email).toEqual("");
    });

    test("should not see an anonymous inmate's data", async () => {
      await models.caseInmate.create(
        new CaseInmate.Builder()
          .defaultCaseInmate()
          .withFirstName("Bobby")
          .withMiddleInitial("B")
          .withLastName("Loblaw")
          .withIsAnonymous(true)
          .withCaseId(existingCase.id)
          .withCreatedAt(new Date(0, 0, 0))
          .build(),
        { auditUser: "user" }
      );

      await models.caseInmate.create(
        new CaseInmate.Builder()
          .defaultCaseInmate()
          .withRoleOnCase(WITNESS)
          .withFirstName("Billy")
          .withMiddleInitial("G")
          .withLastName("Bills")
          .withIsAnonymous(false)
          .withCaseId(existingCase.id)
          .build(),
        { auditUser: "user" }
      );
      const { caseDetails } = await models.sequelize.transaction(
        async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.MANAGE_TAGS
          );
        }
      );

      expect(caseDetails.complainantInmates[0].firstName).toEqual("Anonymous");
      expect(caseDetails.complainantInmates[0].middleInitial).toEqual("");
      expect(caseDetails.complainantInmates[0].lastName).toEqual("");
      expect(caseDetails.complainantInmates[0].fullName).toEqual("Anonymous");

      expect(caseDetails.witnessInmates[0].firstName).toEqual("Billy");
      expect(caseDetails.witnessInmates[0].lastName).toEqual("Bills");
    });
  });

  describe("getCaseWithAllAssocationsAndAuditDetails", () => {
    test("adds pdfAvailable to audit", async () => {
      const caseWithAssociationsAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
          );
        });

      expect(caseWithAssociationsAndAuditDetails.auditDetails).toEqual(
        expect.objectContaining({
          cases: expect.objectContaining({
            attributes: expect.arrayContaining(["pdfAvailable"])
          })
        })
      );
    });

    test("adds isArchived to audit and removes deletedAt", async () => {
      const caseWithAssociationsAndAuditDetails =
        await models.sequelize.transaction(async transaction => {
          return await getCaseWithAllAssociationsAndAuditDetails(
            existingCase.id,
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
          );
        });
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
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
            transaction,
            USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
          );
        }
      );

      expect(caseDetails.isArchived).toBeTruthy();
    });

    test("should throw an error when caseId is not a number", async () => {
      try {
        await getCaseWithAllAssociationsAndAuditDetails("abcdef");
        expect(true).toBeFalse();
      } catch (e) {
        expect(e.message).toInclude("abcdef");
      }
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

  describe("getCaseWithoutAssociations", () => {
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
  employeeId,
  dateCreated
) {
  const officerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withEmployeeId(employeeId)
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

const createAnonymousCivilian = async (
  existingCase,
  role,
  dateCreated,
  genderIdentityId,
  raceEthnicityId
) => {
  const civilianAttributes = new Civilian.Builder()
    .defaultCivilian()
    .withCaseId(existingCase.id)
    .withId(undefined)
    .withRoleOnCase(role)
    .withCreatedAt(dateCreated)
    .withIsAnonymous(true)
    .withGenderIdentityId(genderIdentityId)
    .withRaceEthnicityId(raceEthnicityId)
    .build();

  return await models.civilian.create(civilianAttributes, {
    auditUser: "anonymous someone"
  });
};

const createAnonymousUnknownCivilian = async (
  existingCase,
  role,
  dateCreated
) => {
  const civilianAttributes = new Civilian.Builder()
    .defaultCivilian()
    .withCaseId(existingCase.id)
    .withId(undefined)
    .withFirstName("")
    .withLastName("")
    .withRoleOnCase(role)
    .withCreatedAt(dateCreated)
    .withIsAnonymous(true);

  await models.civilian.create(civilianAttributes, {
    auditUser: "anonymous someone"
  });
};

const createAnonymousCaseOfficer = async (
  existingCase,
  employeeId,
  role,
  dateCreated
) => {
  const officerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withEmployeeId(employeeId)
    .withId(undefined);

  const officer = await models.officer.create(officerAttributes, {
    auditUser: "someone"
  });

  const caseOfficerAttributes = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withId(undefined)
    .withOfficerId(officer.id)
    .withCaseId(existingCase.id)
    .withCreatedAt(dateCreated)
    .withRoleOnCase(role)
    .withIsAnonymous(true);

  await models.case_officer.create(caseOfficerAttributes, {
    auditUser: "anonymous someone"
  });
};
