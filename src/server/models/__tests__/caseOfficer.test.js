import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import models from "../index";
import Officer from "../../../client/testUtilities/Officer";
import { createCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../sharedUtilities/constants";

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
      const initialCase = await createCaseWithoutCivilian();

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
      const initialCase = await createCaseWithoutCivilian();

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
});
