import Case from "../../client/testUtilities/case";
import getCaseWithAllAssociations from "./getCaseWithAllAssociations";
import models from "../models";
import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import Officer from "../../client/testUtilities/Officer";
import { ACCUSED, COMPLAINANT, WITNESS } from "../../sharedUtilities/constants";
import Civilian from "../../client/testUtilities/civilian";

describe("getCaseWithAllAssocations", () => {
  let existingCase, referralLetter;
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
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("adds pdfAvailable as true if there is a pdf file name on the referral letter", async () => {
    await referralLetter.update(
      { finalPdfFilename: "something.pdf" },
      { auditUser: "someone" }
    );
    let caseWithAllAssociations;
    await models.sequelize.transaction(async transaction => {
      caseWithAllAssociations = await getCaseWithAllAssociations(
        existingCase.id,
        transaction
      );
    });
    expect(caseWithAllAssociations.pdfAvailable).toEqual(true);
    expect(caseWithAllAssociations.referralLetter).toBeUndefined();
  });
  test("adds pdfAvailable as false if there is not a pdf file name on the referral letter", async () => {
    let caseWithAllAssociations;
    await models.sequelize.transaction(async transaction => {
      caseWithAllAssociations = await getCaseWithAllAssociations(
        existingCase.id,
        transaction
      );
    });
    expect(caseWithAllAssociations.pdfAvailable).toEqual(false);
    expect(caseWithAllAssociations.referralLetter).toBeUndefined();
  });
  test("returns accusedOfficers in ascending order of their createdAt date", async () => {
    await createUnknownAccusedCaseOfficer(existingCase);
    await createCaseOfficer(existingCase, ACCUSED, 912);

    let caseWithAllAssociations;
    await models.sequelize.transaction(async transaction => {
      caseWithAllAssociations = await getCaseWithAllAssociations(
        existingCase.id,
        transaction
      );
    });
    expect(
      caseWithAllAssociations.accusedOfficers[0].createdAt <
        caseWithAllAssociations.accusedOfficers[1].createdAt
    ).toEqual(true);
  });
  test("returns complainants in ascending order of their createdAt date", async () => {
    await createCaseOfficer(existingCase, COMPLAINANT, 234);
    await createCaseOfficer(existingCase, COMPLAINANT, 123);
    await createCivilian(existingCase, COMPLAINANT);
    await createCivilian(existingCase, COMPLAINANT);

    let caseWithAllAssociations;
    await models.sequelize.transaction(async transaction => {
      caseWithAllAssociations = await getCaseWithAllAssociations(
        existingCase.id,
        transaction
      );
    });
    expect(
      caseWithAllAssociations.complainantOfficers[0].createdAt <
        caseWithAllAssociations.complainantOfficers[1].createdAt
    ).toEqual(true);
    expect(
      caseWithAllAssociations.complainantCivilians[0].createdAt <
        caseWithAllAssociations.complainantCivilians[1].createdAt
    ).toEqual(true);
  });
});

async function createCaseOfficer(existingCase, role, officerNumber) {
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
    .withRoleOnCase(role);

  await models.case_officer.create(caseOfficerAttributes, {
    auditUser: "someone"
  });
}

async function createUnknownAccusedCaseOfficer(existingCase) {
  const unknownCaseOfficerAttributes = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withUnknownOfficer()
    .withCaseId(existingCase.id);

  await models.case_officer.create(unknownCaseOfficerAttributes, {
    auditUser: "someone"
  });
}

async function createCivilian(existingCase, role) {
  const civilianAttributes = new Civilian.Builder()
    .defaultCivilian()
    .withCaseId(existingCase.id)
    .withId(undefined)
    .withRoleOnCase(role);

  await models.civilian.create(civilianAttributes, {
    auditUser: "someone"
  });
}
