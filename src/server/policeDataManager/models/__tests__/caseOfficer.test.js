import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import models from "../index";
import Officer from "../../../../sharedTestHelpers/Officer";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { ACCUSED, CASE_STATUS } from "../../../../sharedUtilities/constants";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import LetterOfficer from "../../../testHelpers/LetterOfficer";

describe("caseOfficer", () => {
  describe("isUnknownOfficer", () => {
    test("returns true if officerId is null", () => {
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer();
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.isUnknownOfficer).toEqual(true);
    });

    test("returns false if there is an officerId", () => {
      const caseOfficerAttributes = new CaseOfficer.Builder().defaultCaseOfficer();
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.isUnknownOfficer).toEqual(false);
    });
  });
  describe("supervisor name", () => {
    test("returns full name when all fields present", () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Monica")
        .withMiddleName("Jane")
        .withLastName("Jones");
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withSupervisor(officerAttributes);
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.supervisorFullName).toEqual("Monica Jane Jones");
    });
    test("returns full name when no middle name present", () => {
      const officerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Monica")
        .withMiddleName(null)
        .withLastName("Jones");
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withSupervisor(officerAttributes);
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.supervisorFullName).toEqual("Monica Jones");
    });
    test("returns full name when no supervisor", () => {
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withNoSupervisor();
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.supervisorFullName).toEqual("");
    });
  });

  describe("updating case status", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should update case status when adding a case officer", async () => {
      const initialCase = await createTestCaseWithoutCivilian();

      const caseOfficerToCreate = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withUnknownOfficer()
        .build();

      expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
      await models.case_officer.create(caseOfficerToCreate, {
        auditUser: "someone"
      });

      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
    });

    test("should NOT update case status when adding a case officer is unsuccessful", async () => {
      const initialCase = await createTestCaseWithoutCivilian();

      const caseOfficerToCreate = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withRoleOnCase(null)
        .withUnknownOfficer()
        .build();

      expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
      try {
        await models.case_officer.create(caseOfficerToCreate, {
          auditUser: "someone"
        });
      } catch (error) {}

      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
    });
  });

  describe("deleting officer allegations", function () {
    afterEach(async () => {
      await cleanupDatabase();
    });
    test("it should delete associated officer allegations when case officer deleted", async () => {
      const initialCase = await createTestCaseWithoutCivilian();

      const caseOfficerToCreate = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withRoleOnCase(ACCUSED)
        .withUnknownOfficer()
        .build();

      const caseOfficer = await models.case_officer.create(
        caseOfficerToCreate,
        { auditUser: "someone" }
      );

      const allegationAttributes = new Allegation.Builder()
        .withId(undefined)
        .defaultAllegation()
        .build();

      const allegation = await models.allegation.create(allegationAttributes, {
        auditUser: "someone"
      });

      const officerAllegationAttributes = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation.id)
        .withCaseOfficerId(caseOfficer.id)
        .build();

      const officerAllegation = await models.officer_allegation.create(
        officerAllegationAttributes,
        { auditUser: "someone" }
      );

      expect(officerAllegation.deletedAt).toEqual(null);

      await models.case_officer.destroy({
        where: { id: caseOfficer.id },
        auditUser: "someone"
      });

      const retrievedOfficerAllegation = await models.officer_allegation.findByPk(
        officerAllegation.id,
        { transaction: null, paranoid: false }
      );

      expect(retrievedOfficerAllegation.deletedAt).not.toEqual(null);
    });

    test("it should delete associated referral letter officers when case officer deleted", async () => {
      const initialCase = await createTestCaseWithoutCivilian();

      const caseOfficerToCreate = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withRoleOnCase(ACCUSED)
        .withUnknownOfficer()
        .build();
      const caseOfficer = await models.case_officer.create(
        caseOfficerToCreate,
        { auditUser: "someone" }
      );
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(caseOfficer.id);
      const letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "test" }
      );

      expect(letterOfficer.deletedAt).toEqual(null);

      await models.sequelize.transaction(
        async transaction =>
          await models.case_officer.destroy({
            where: { id: caseOfficer.id },
            auditUser: "someone",
            transaction
          })
      );

      await letterOfficer.reload({ paranoid: false });
      expect(letterOfficer.deletedAt).not.toEqual(null);
    });
  });
});
