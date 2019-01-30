import models from "../models";
import { AUDIT_ACTION, AUDIT_SUBJECT } from "../../sharedUtilities/constants";
import auditDataAccess from "./auditDataAccess";
import { createTestCaseWithoutCivilian } from "../testHelpers/modelMothers";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("auditDataAccess", () => {
  describe("subject details", () => {
    let caseForAudit;
    beforeEach(async () => {
      caseForAudit = await createTestCaseWithoutCivilian();
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("it should populate details correctly for case details subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual([
        "Case Information",
        "Incident Location",
        "Civilian Complainants",
        "Officer Complainants",
        "Civilian Witnesses",
        "Officer Witnesses",
        "Civilian Address",
        "Accused Officers",
        "Allegations",
        "Attachments"
      ]);
    });

    test("it should populate details correctly for all cases subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.ALL_CASES,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual([
        "Case Information",
        "Civilian Complainants",
        "Officer Complainants",
        "Accused Officers"
      ]);
    });

    test("it should populate details correctly for case history subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_HISTORY,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual([
        "Case Information",
        "Incident Location",
        "Civilian Complainants",
        "Officer Complainants",
        "Civilian Witnesses",
        "Officer Witnesses",
        "Civilian Address",
        "Accused Officers",
        "Allegations",
        "Attachments",
        "Case Notes"
      ]);
    });

    test("it should populate details correctly for case notes subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_NOTES,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual(["Case Notes"]);
    });

    test("it should populate details correctly for case reference subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.MINIMUM_CASE_DETAILS,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual([
        "Case Reference",
        "Case Status"
      ]);
    });

    test("it should populate details correctly for letter type subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.LETTER_TYPE,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual(["Letter Type"]);
    });

    test("it should populate details correctly for officer data subject", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          undefined,
          AUDIT_SUBJECT.OFFICER_DATA,
          transaction
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { subject: AUDIT_SUBJECT.OFFICER_DATA }
      });
      expect(createdAudits.length).toEqual(1);

      expect(createdAudits[0].subjectDetails).toEqual(["Officers"]);
    });

    test("it should populate details correctly for downloaded action with subject details given", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.ATTACHMENTS,
          transaction,
          AUDIT_ACTION.DOWNLOADED,
          { fileName: "cats.jpg" }
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);
      expect(createdAudits[0].subjectDetails).toEqual({ fileName: "cats.jpg" });
    });
  });
});
