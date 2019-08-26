import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Case from "../../../client/testUtilities/case";
import updatePastCasesMigration from "../migrations/001_add_referral_letter_and_letter_officers_to_cases_past_letter_flow.js";
import models from "../../models";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import Officer from "../../../client/testUtilities/Officer";
import { ACCUSED, CASE_STATUS } from "../../../sharedUtilities/constants";
import ReferralLetter from "../../../client/testUtilities/ReferralLetter";
import LetterOfficer from "../../../client/testUtilities/LetterOfficer";

describe("migration to add referral letter and letter officer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  let existingCase, caseOfficer;

  beforeEach(async () => {
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "test"
    });

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(123);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withOfficerId(officer.id)
      .withRoleOnCase(ACCUSED);

    caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
      auditUser: "test"
    });
  });

  describe("case past letter flow without referral letter and letter officers", () => {
    beforeEach(async () => {
      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );
    });

    test("should add referral letter and letter officer to case in ready for review status", async () => {
      await updatePastCasesMigration.up();

      await existingCase.reload({
        include: [
          { model: models.referral_letter, as: "referralLetter" },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.referralLetter).not.toBeNull();
      expect(existingCase.referralLetter.sender).not.toBeNull();
      expect(existingCase.accusedOfficers[0].letterOfficer).not.toBeNull();
    });

    test("should delete created referral letter and letter officers when migrating down", async () => {
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();

      await existingCase.reload({
        include: [
          { model: models.referral_letter, as: "referralLetter" },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.referralLetter).toBeNull();
      expect(existingCase.accusedOfficers[0].letterOfficer).toBeNull();
    });

    test("should delete created referral letter and letter officers when migrating multiple times", async () => {
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();

      await existingCase.reload({
        include: [
          { model: models.referral_letter, as: "referralLetter" },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.referralLetter).toBeNull();
      expect(existingCase.accusedOfficers[0].letterOfficer).toBeNull();
    });
  });

  describe("active case", () => {
    beforeEach(async () => {
      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "test" }
      );
    });

    test("test that referral letters and letter officers are not created for a case in active status", async () => {
      await updatePastCasesMigration.up();

      await existingCase.reload({
        include: [
          { model: models.referral_letter, as: "referralLetter" },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.referralLetter).toBeNull();
      existingCase.accusedOfficers.forEach(accusedOfficer => {
        expect(accusedOfficer.letterOfficer).toBeNull();
      });
    });
  });

  describe("referral letter and letter officer does exist in case status past letter generation", () => {
    const migrationTestSender = "migrationTestSender";
    const numHighAllegations = 3;

    beforeEach(async () => {
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withSender(migrationTestSender);
      await models.referral_letter.create(referralLetterAttributes, {
        auditUser: "test"
      });

      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "test" }
      );

      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id)
        .withNumHistoricalHighAllegations(numHighAllegations);

      await models.letter_officer.create(letterOfficerAttributes, {
        auditUser: "test"
      });
    });

    test("migration does not overwrite referral letter", async () => {
      await updatePastCasesMigration.up();

      await existingCase.reload({
        include: [{ model: models.referral_letter, as: "referralLetter" }]
      });

      expect(existingCase.referralLetter.sender).toEqual(migrationTestSender);
    });

    test("should not overwrite already existing letter officer", async () => {
      await updatePastCasesMigration.up();

      await existingCase.reload({
        include: [
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.accusedOfficers.length).toEqual(1);
      expect(
        existingCase.accusedOfficers[0].letterOfficer
          .numHistoricalHighAllegations
      ).toEqual(numHighAllegations);
    });

    test("should not delete letters or letter officers on migration down", async () => {
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();

      await existingCase.reload({
        include: [
          { model: models.referral_letter, as: "referralLetter" },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            include: [{ model: models.letter_officer, as: "letterOfficer" }]
          }
        ]
      });

      expect(existingCase.referralLetter).not.toBeNull();
      expect(existingCase.accusedOfficers[0].letterOfficer).not.toBeNull();
    });
  });
});
