import constructFilename from "./constructFilename";
import models from "../../../policeDataManager/models";
import {
  CIVILIAN_INITIATED,
  COMPLAINANT,
  COMPLAINANT_LETTER,
  EDIT_STATUS,
  RANK_INITIATED,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";
import Case from "../../../../sharedTestHelpers/case";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("constructFilename", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("complainant is type: civilian initiated", () => {
    let existingCase;

    beforeEach(async () => {
      existingCase = await createCase(CIVILIAN_INITIATED);
    });

    test("returns correct final pdf filename with primary civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename = "5-5-2012_CC2012-0001_PIB_Referral_Smith.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct generated preview pdf filename with civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.GENERATED
      );
      const expectedFilename =
        "5-5-2012_CC2012-0001_Generated_Referral_Draft_Smith.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct edited preview pdf filename with civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.EDITED
      );
      const expectedFilename =
        "5-5-2012_CC2012-0001_Edited_Referral_Draft_Smith.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returned correct filename when letterType is complainant", async () => {
      const filename = constructFilename(existingCase, COMPLAINANT_LETTER);
      expect(filename).toEqual(
        "5-5-2012_CC2012-0001_Letter_to_Complainant_Smith.pdf"
      );
    });
  });

  describe("complainant is type: civilian initiated and isAnonymous: true", () => {
    let existingCase;

    beforeEach(async () => {
      existingCase = await createCase(CIVILIAN_INITIATED, true);
    });

    test("returns correct final pdf filename with anonymous primary civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename =
        "5-5-2012_AC2012-0001_PIB_Referral_Anonymous.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct generated preview pdf filename with anonymous civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.GENERATED
      );
      const expectedFilename =
        "5-5-2012_AC2012-0001_Generated_Referral_Draft_Anonymous.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct edited preview pdf filename with anonymous civilian complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.EDITED
      );
      const expectedFilename =
        "5-5-2012_AC2012-0001_Edited_Referral_Draft_Anonymous.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("should still return last in filename when letterType is complainant and complainant is anonymous", async () => {
      const filename = constructFilename(existingCase, COMPLAINANT_LETTER);
      expect(filename).toEqual(
        "5-5-2012_AC2012-0001_Letter_to_Complainant_Smith.pdf"
      );
    });
  });

  describe("no complainant", () => {
    let existingCase;
    beforeEach(async () => {
      existingCase = await createCase();
    });

    test("returns correct final pdf filename without complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename = "5-5-2012_CC2012-0001_PIB_Referral.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct generated preview pdf filename without complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.GENERATED
      );
      const expectedFilename =
        "5-5-2012_CC2012-0001_Generated_Referral_Draft.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct edited preview pdf filename without complainant", async () => {
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.EDITED
      );
      const expectedFilename = "5-5-2012_CC2012-0001_Edited_Referral_Draft.pdf";
      expect(filename).toEqual(expectedFilename);
    });
  });

  describe("complainant is type: rank initiated", () => {
    test("returns correct final pdf filename with primary officer complainant", async () => {
      const existingCase = await createCase(RANK_INITIATED);
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename = "5-5-2012_PO2012-0001_PIB_Referral_Jones.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returns correct final pdf filename with anonymous primary officer complainant", async () => {
      const existingCase = await createCase(RANK_INITIATED, true);
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename =
        "5-5-2012_AC2012-0001_PIB_Referral_Anonymous.pdf";
      expect(filename).toEqual(expectedFilename);
    });

    test("returned correct filename with unknown_officer as suffix", async () => {
      const existingCase = await createUnknownOfficerCase();
      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.DRAFT,
        EDIT_STATUS.EDITED
      );
      const expectedFilename =
        "5-5-2012_PO2012-0001_Edited_Referral_Draft_Unknown_Officer.pdf";
      expect(filename).toEqual(expectedFilename);
    });
  });

  describe("compliant has both civilian and police officer complainants", () => {
    let existingCase;

    beforeEach(async () => {
      existingCase = await createCase(CIVILIAN_INITIATED);
    });

    test("should generate correct filename based on primary complainant as primary complainant is updated", async () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withLastName("Iamofficer");

      const officer = await models.officer.create(officerAttributes, {
        auditUser: "user"
      });

      const caseOfficerToCreate = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(officer.id)
        .withCaseId(existingCase.id)
        .withRoleOnCase(COMPLAINANT)
        .withCreatedAt("2017-12-31")
        .withOfficerAttributes(officerAttributes);

      await models.case_officer.create(caseOfficerToCreate, {
        auditUser: "someone"
      });

      await existingCase.reload();

      const filename = constructFilename(
        existingCase,
        REFERRAL_LETTER_VERSION.FINAL
      );
      const expectedFilename =
        "5-5-2012_PO2012-0001_PIB_Referral_Iamofficer.pdf";
      expect(filename).toEqual(expectedFilename);
    });
  });
});

const createCase = async (complaintType, isAnonymous = false) => {
  const civilianComplainants =
    complaintType === CIVILIAN_INITIATED
      ? [
          {
            firstName: "SecondCivFirstName",
            lastName: "Second Civ Complainant",
            isAnonymous: isAnonymous,
            createdAt: "2018-02-01"
          },
          {
            firstName: "First",
            lastName: "Smith",
            isAnonymous: isAnonymous,
            createdAt: "2018-01-01"
          }
        ]
      : [];

  const firstOfficer = await createOfficer({
    firstName: "First",
    lastName: "2nd Off Complainant",
    officerNumber: 1
  });
  const secondOfficer = await createOfficer({
    firstName: "First",
    lastName: "Jones",
    officerNumber: 2
  });

  const officerComplainants =
    complaintType === RANK_INITIATED
      ? [
          {
            firstName: "First",
            lastName: "2nd Off Complainant",
            roleOnCase: COMPLAINANT,
            isAnonymous: isAnonymous,
            createdAt: "2018-02-01",
            officerId: firstOfficer.id
          },
          {
            firstName: "First",
            lastName: "Jones",
            roleOnCase: COMPLAINANT,
            isAnonymous: isAnonymous,
            createdAt: "2018-01-01",
            officerId: secondOfficer.id
          }
        ]
      : [];

  const existingCaseAttributes = new Case.Builder()
    .defaultCase()
    .withFirstContactDate("2012-05-05")
    .withId(88)
    .withComplaintType(complaintType || CIVILIAN_INITIATED)
    .withComplainantCivilians(civilianComplainants)
    .withComplainantOfficers(officerComplainants);
  return await models.cases.create(existingCaseAttributes, {
    auditUser: "someone",
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        auditUser: "someone"
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        auditUser: "someone"
      }
    ]
  });
};

const createUnknownOfficerCase = async () => {
  const officerComplainants = [
    {
      firstName: null,
      lastName: null,
      roleOnCase: COMPLAINANT,
      createdAt: "2018-02-01"
    }
  ];
  const existingCaseAttributes = new Case.Builder()
    .defaultCase()
    .withFirstContactDate("2012-05-05")
    .withId(88)
    .withComplaintType(RANK_INITIATED)
    .withComplainantOfficers(officerComplainants);
  return await models.cases.create(existingCaseAttributes, {
    auditUser: "someone",
    include: [
      {
        model: models.case_officer,
        as: "complainantOfficers",
        auditUser: "someone"
      }
    ]
  });
};

const createOfficer = async officerAttributes => {
  const builtOfficerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withFirstName(officerAttributes.firstName)
    .withLastName(officerAttributes.lastName)
    .withOfficerNumber(officerAttributes.officerNumber)
    .withId(undefined);

  return await models.officer.create(builtOfficerAttributes, {
    auditUser: "someone"
  });
};
