import constructFilename from "./constructFilename";
import models from "../../../models";
import {
  CIVILIAN_INITIATED,
  COMPLAINANT,
  COMPLAINANT_LETTER,
  LETTER_TYPE,
  RANK_INITIATED,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";
import Case from "../../../../client/testUtilities/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../client/testUtilities/Officer";

describe("constructFilename", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns correct final pdf filename with first civilian complainant", async () => {
    const existingCase = await createCase(CIVILIAN_INITIATED);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "88/5-5-2012_CC2012-0001_PIB_Referral_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct final pdf filename with first officer complainant", async () => {
    const existingCase = await createCase(RANK_INITIATED);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "88/5-5-2012_PO2012-0001_PIB_Referral_Jones.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct final pdf filename without complainant", async () => {
    const existingCase = await createCase();
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "88/5-5-2012_CC2012-0001_PIB_Referral.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename with civilian complainant", async () => {
    const existingCase = await createCase(CIVILIAN_INITIATED);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0001_Generated_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename without complainant", async () => {
    const existingCase = await createCase();
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0001_Generated_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename with civilian complainant", async () => {
    const existingCase = await createCase(CIVILIAN_INITIATED);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0001_Edited_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename without complainant", async () => {
    const existingCase = await createCase();
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename = "5-5-2012_CC2012-0001_Edited_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returned correct filename with unknown_officer as suffix", async () => {
    const existingCase = await createUnknownOfficerCase();
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename =
      "5-5-2012_PO2012-0001_Edited_Referral_Draft_Unknown_Officer.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returned correct filename when letterType is complainant", async () => {
    const existingCase = await createCase(CIVILIAN_INITIATED);
    const filename = constructFilename(existingCase, COMPLAINANT_LETTER);
    expect(filename).toEqual(
      "5-5-2012_CC2012-0001_Letter_to_Complainant_Smith.pdf"
    );
  });
});

const createCase = async complaintType => {
  const civilianComplainants =
    complaintType === CIVILIAN_INITIATED
      ? [
          {
            firstName: "SecondCivFirstName",
            lastName: "Second Civ Complainant",
            createdAt: "2018-02-01"
          },
          { firstName: "First", lastName: "Smith", createdAt: "2018-01-01" }
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
            createdAt: "2018-02-01",
            officerId: firstOfficer.id
          },
          {
            firstName: "First",
            lastName: "Jones",
            roleOnCase: COMPLAINANT,
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
