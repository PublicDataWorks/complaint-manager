import models from "../models";
import { AUDIT_SUBJECT, AUDIT_ACTION } from "../../sharedUtilities/constants";
import auditDataAccess from "./auditDataAccess";
import { createCaseWithoutCivilian } from "../testHelpers/modelMothers";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("auditDataAccess", () => {
  describe("subject details", () => {
    let caseForAudit;
    beforeEach(async () => {
      caseForAudit = await createCaseWithoutCivilian();
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
        "Case",
        "Incident Location",
        "Complainants",
        "Civilian Address",
        "Witnesses",
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
        "Cases",
        "Complainants",
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
        "Case",
        "Incident Location",
        "Complainants",
        "Civilian Address",
        "Witnesses",
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
