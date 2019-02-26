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

    test("should replace attributes if all fields are present", async () => {
      const subjectDetails = {
        cases: {
          attributes: Object.keys(models.cases.rawAttributes)
        },
        complainantCivilians: {
          attributes: Object.keys(models.civilian.rawAttributes),
          model: "civilian"
        }
      };

      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          subjectDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.subjectDetails).toEqual({
        Case: ["All Case Data"],
        "Complainant Civilians": ["All Complainant Civilians Data"]
      });
    });

    test("should include edit status in subject details in addition to all case data", async () => {
      const subjectDetails = {
        cases: {
          attributes: [
            ...Object.keys(models.cases.rawAttributes),
            "Edit Status"
          ]
        }
      };

      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          subjectDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.subjectDetails).toEqual({
        Case: ["All Case Data", "Edit Status"]
      });
    });

    test("should reformat subjectDetails when attributes exist", async () => {
      const subjectDetails = {
        cases: {
          attributes: ["id", "status", "incidentDate"]
        },
        complainantCivilians: {
          attributes: ["firstName", "lastName"],
          model: "civilian"
        }
      };

      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          subjectDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.subjectDetails).toEqual({
        Case: ["Id", "Incident Date", "Status"],
        "Complainant Civilians": ["First Name", "Last Name"]
      });
    });

    test("it should populate subjectDetails correctly", async () => {
      const subjectDetails = {
        fileName: ["cats.jpg"],
        otherField: ["hello"]
      };

      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          subjectDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.subjectDetails).toEqual(subjectDetails);
    });

    test("it should populate details correctly for downloaded action with subject details given", async () => {
      await models.sequelize.transaction(async transaction => {
        await auditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.ATTACHMENT,
          transaction,
          AUDIT_ACTION.DOWNLOADED,
          { fileName: ["cats.jpg"] }
        );
      });

      const createdAudits = await models.action_audit.findAll({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudits.length).toEqual(1);
      expect(createdAudits[0].subjectDetails).toEqual({
        fileName: ["cats.jpg"]
      });
    });
  });
});
