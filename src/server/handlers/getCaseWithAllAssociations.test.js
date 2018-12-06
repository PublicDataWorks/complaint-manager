import Case from "../../client/testUtilities/case";
import getCaseWithAllAssociations from "./getCaseWithAllAssociations";
import models from "../models";
import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

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
});
