import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import models from "../index";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { ACCUSED, CASE_STATUS } from "../../../../sharedUtilities/constants";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import LetterOfficer from "../../../testHelpers/LetterOfficer";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("caseOfficer", () => {
  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("isUnknownOfficer", () => {
    test("returns true if officerId is null", () => {
      const caseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer();
      const caseOfficer = models.case_officer.build(caseOfficerAttributes);
      expect(caseOfficer.isUnknownOfficer).toEqual(true);
    });

    test("returns false if there is an officerId", () => {
      const caseOfficerAttributes =
        new CaseOfficer.Builder().defaultCaseOfficer();
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

  describe("deleting officer allegations", function () {
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

      const retrievedOfficerAllegation =
        await models.officer_allegation.findByPk(officerAllegation.id, {
          transaction: null,
          paranoid: false
        });

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

  test("should not allow notes to be set to null", async () => {
    const initialCase = await createTestCaseWithoutCivilian();

    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer().build(),
      { auditUser: "user" }
    );

    const notes = "THESE ARE NOTES!!!!!!!";
    const caseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withCaseId(initialCase.id)
        .withOfficerId(officer.id)
        .withNotes(notes)
        .build(),
      { auditUser: "user" }
    );

    caseOfficer.notes = null;
    expect(caseOfficer.notes).toEqual(notes);
  });

  test("emptyCaseOfficerAttributes should set everything to null except caseEmployeeType", async () => {
    const caseOfficer = models.case_officer
      .build()
      .emptyCaseOfficerAttributes();
    expect(caseOfficer.officerId).toBeNull();
    expect(caseOfficer.firstName).toBeNull();
    expect(caseOfficer.middleName).toBeNull();
    expect(caseOfficer.lastName).toBeNull();
    expect(caseOfficer.windowsUsername).toBeNull();
    expect(caseOfficer.supervisorFirstName).toBeNull();
    expect(caseOfficer.supervisorMiddleName).toBeNull();
    expect(caseOfficer.supervisorLastName).toBeNull();
    expect(caseOfficer.supervisorWindowsUsername).toBeNull();
    expect(caseOfficer.supervisorOfficerNumber).toBeNull();
    expect(caseOfficer.employeeType).toBeNull();
    expect(caseOfficer.district).toBeNull();
    expect(caseOfficer.bureau).toBeNull();
    expect(caseOfficer.rank).toBeNull();
    expect(caseOfficer.dob).toBeNull();
    expect(caseOfficer.endDate).toBeNull();
    expect(caseOfficer.hireDate).toBeNull();
    expect(caseOfficer.sex).toBeNull();
    expect(caseOfficer.race).toBeNull();
    expect(caseOfficer.workStatus).toBeNull();
    expect(caseOfficer.caseEmployeeType).toEqual(
      PERSON_TYPE.UNKNOWN_OFFICER.employeeDescription
    );
  });
});
