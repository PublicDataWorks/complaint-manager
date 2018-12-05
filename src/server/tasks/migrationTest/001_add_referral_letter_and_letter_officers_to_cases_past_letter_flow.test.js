import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Case from "../../../client/testUtilities/case";
import updatePastCasesMigration from "../migrations/001_add_referral_letter_and_letter_officers_to_cases_past_letter_flow.js";
import models from "../../models";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import Officer from "../../../client/testUtilities/Officer";
import {
  ACCUSED,
  CASE_STATUS,
  REFERRAL_LETTER_VERSION
} from "../../../sharedUtilities/constants";
import ReferralLetter from "../../../client/testUtilities/ReferralLetter";
import LetterOfficer from "../../../client/testUtilities/LetterOfficer";
import constructFilename from "../../handlers/cases/referralLetters/constructFilename";
import Civilian from "../../../client/testUtilities/civilian";

describe("migration to add referral letter and letter officer", async () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("case past letter flow without referral letter and letter officers", () => {
    let existingCase;

    beforeEach(async () => {
      const existingCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined);

      existingCase = await models.cases.create(existingCaseAttributes, {
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

      await models.case_officer.create(caseOfficerAttributes, {
        auditUser: "test"
      });
    });

    test("should add referral letter and letter officer to case in ready for review status", async () => {
      await updatePastCasesMigration.up();

      const referralLetter = await models.referral_letter.findOne({
        where: {
          caseId: existingCase.id
        }
      });

      const caseOfficers = await models.case_officer.findAll({
        where: { caseId: existingCase.id }
      });

      expect(referralLetter).not.toBeNull();
      expect(referralLetter.finalPdfFilename).toBeNull();
      expect(referralLetter.sender).not.toBeNull();

      for (let i = 0; i < caseOfficers.length; i++) {
        const letterOfficer = await models.letter_officer.findOne({
          where: {
            caseOfficerId: caseOfficers[i].id
          }
        });
        expect(letterOfficer).not.toBeNull();
      }
    });

    test("should add finalPdfFilename if letter is in forwarded to agency", async () => {
      await existingCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "test" }
      );

      await updatePastCasesMigration.up();

      const referralLetter = await models.referral_letter.findOne({
        where: {
          caseId: existingCase.id
        }
      });

      expect(referralLetter).not.toBeNull();
      expect(referralLetter.sender).not.toBeNull();
      expect(referralLetter.finalPdfFilename).toEqual(
        constructFilename(
          existingCase.id,
          existingCase.caseNumber,
          existingCase.firstContactDate,
          null,
          REFERRAL_LETTER_VERSION.FINAL
        )
      );
    });

    test("should return already existing civilian after data migration", async () => {
      const testCivilianLastName = "testCivilianLastName";
      const civilianAttributes = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withLastName(testCivilianLastName)
        .withCaseId(existingCase.id);
      const civilian = await models.civilian.create(civilianAttributes, {
        auditUser: "test"
      });

      await existingCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "test" }
      );

      await updatePastCasesMigration.up();

      const existingCivilian = await models.civilian.findOne({
        where: {
          id: civilian.id
        }
      });
      expect(existingCivilian.lastName).toEqual(testCivilianLastName);

      const referralLetter = await models.referral_letter.findOne({
        where: {
          caseId: existingCase.id
        }
      });

      expect(referralLetter).not.toBeNull();
      expect(referralLetter.sender).not.toBeNull();
      expect(referralLetter.finalPdfFilename).toEqual(
        constructFilename(
          existingCase.id,
          existingCase.caseNumber,
          existingCase.firstContactDate,
          testCivilianLastName,
          REFERRAL_LETTER_VERSION.FINAL
        )
      );
    });

    test("should delete created referral letter and letter officers when migrating down", async () => {
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();

      const referralLetter = await models.referral_letter.findOne({
        where: {
          caseId: existingCase.id
        }
      });

      const theCase = await models.cases.findOne({
        where: {
          id: existingCase.id
        }
      });

      const caseOfficers = await models.case_officer.findAll({
        where: { caseId: existingCase.id }
      });

      expect(referralLetter).toBeNull();
      expect(theCase).not.toBeNull();

      for (let i = 0; i < caseOfficers.length; i++) {
        expect(caseOfficers[i]).not.toBeNull();
        const letterOfficer = await models.letter_officer.findOne({
          where: {
            caseOfficerId: caseOfficers[i].id
          }
        });
        expect(letterOfficer).toBeNull();
      }
    });

    test("should delete created referral letter and letter officers when migrating multiple times", async () => {
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();
      await updatePastCasesMigration.up();
      await updatePastCasesMigration.down();

      const referralLetters = await models.referral_letter.findAll({
        where: {
          caseId: existingCase.id
        }
      });

      const theCase = await models.cases.findOne({
        where: {
          id: existingCase.id
        }
      });

      const caseOfficers = await models.case_officer.findAll({
        where: { caseId: existingCase.id }
      });

      expect(referralLetters.length).toEqual(0);
      expect(theCase).not.toBeNull();

      for (let i = 0; i < caseOfficers.length; i++) {
        expect(caseOfficers[i]).not.toBeNull();
        const letterOfficers = await models.letter_officer.findAll({
          where: {
            caseOfficerId: caseOfficers[i].id
          }
        });
        expect(letterOfficers.length).toEqual(0);
      }
    });
  });

  describe("active case", () => {
    let existingCase;
    beforeEach(async () => {
      const existingCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined);

      existingCase = await models.cases.create(existingCaseAttributes, {
        auditUser: "test"
      });

      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "test" }
      );

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

      await models.case_officer.create(caseOfficerAttributes, {
        auditUser: "test"
      });
    });

    test("test that referral letters and letter officers are not created for a case in active status", async () => {
      await updatePastCasesMigration.up();
      const referralLetters = await models.referral_letter.findAll({
        where: {
          caseId: existingCase.id
        }
      });

      const theCase = await models.cases.findOne({
        where: {
          id: existingCase.id
        }
      });

      const caseOfficers = await models.case_officer.findAll({
        where: { caseId: existingCase.id }
      });

      expect(referralLetters.length).toEqual(0);
      expect(theCase).not.toBeNull();

      for (let i = 0; i < caseOfficers.length; i++) {
        expect(caseOfficers[i]).not.toBeNull();
        const letterOfficers = await models.letter_officer.findAll({
          where: {
            caseOfficerId: caseOfficers[i].id
          }
        });
        expect(letterOfficers.length).toEqual(0);
      }
    });
  });

  describe("referral letter and letter officer does exist", async () => {
    const migrationTestSender = "migrationTestSender";
    const numHighAllegations = 3;
    let existingCase;

    beforeEach(async () => {
      const existingCaseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined);
      existingCase = await models.cases.create(existingCaseAttributes, {
        auditUser: "test"
      });

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

      const caseOfficer = await models.case_officer.create(
        caseOfficerAttributes,
        {
          auditUser: "test"
        }
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
      const referralLetters = await models.referral_letter.findAll({
        where: {
          caseId: existingCase.id
        }
      });

      await models.cases.findOne({
        where: {
          id: existingCase.id
        }
      });

      expect(referralLetters.length).toEqual(1);
      expect(referralLetters[0].sender).toEqual(migrationTestSender);
    });

    test("should not overwrite already existing letter officer", async () => {
      const caseOfficers = await models.case_officer.findAll({
        where: { caseId: existingCase.id }
      });

      expect(caseOfficers.length).toEqual(1);

      for (let i = 0; i < caseOfficers.length; i++) {
        expect(caseOfficers[i]).not.toBeNull();
        const letterOfficers = await models.letter_officer.findAll({
          where: {
            caseOfficerId: caseOfficers[i].id
          }
        });
        expect(letterOfficers.length).toEqual(1);
        expect(letterOfficers[i].numHistoricalHighAllegations).toEqual(
          numHighAllegations
        );
      }
    });
  });
});
