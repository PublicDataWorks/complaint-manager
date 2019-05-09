import models from "../models";
import { AUDIT_ACTION, AUDIT_SUBJECT } from "../../sharedUtilities/constants";
import legacyAuditDataAccess from "./legacyAuditDataAccess";
import { createTestCaseWithoutCivilian } from "../testHelpers/modelMothers";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("legacyAuditDataAccess", () => {
  describe("audit details", () => {
    let caseForAudit;
    beforeEach(async () => {
      caseForAudit = await createTestCaseWithoutCivilian();
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should replace attributes if all fields are present", async () => {
      const auditDetails = {
        cases: {
          attributes: Object.keys(models.cases.rawAttributes)
        },
        complainantCivilians: {
          attributes: Object.keys(models.civilian.rawAttributes),
          model: "civilian"
        }
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.auditDetails).toEqual({
        Case: ["All Case Data"],
        "Complainant Civilians": ["All Complainant Civilians Data"]
      });
    });

    test("should replace attributes with All Complainant Civilian Data", async () => {
      const auditDetails = {
        complainantCivilians: {
          attributes: Object.keys(models.civilian.rawAttributes),
          model: models.civilian.name
        }
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.auditDetails).toEqual({
        "Complainant Civilians": ["All Complainant Civilians Data"]
      });
    });

    test("should include edit status in audit details in addition to all case data", async () => {
      const auditDetails = {
        cases: {
          attributes: [
            ...Object.keys(models.cases.rawAttributes),
            "Edit Status"
          ]
        }
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.auditDetails).toEqual({
        Case: ["All Case Data", "Edit Status"]
      });
    });

    test("formats audit details fields for subjects without models", async () => {
      const auditDetails = {
        cases: {
          attributes: ["id", "status"]
        },
        earliestAddedAccusedOfficer: {
          attributes: ["firstName", "middleName", "lastName", "personType"]
        },
        earliestAddedComplainant: {
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "suffix",
            "personType"
          ]
        }
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });
      expect(createdAudit.auditDetails).toEqual({
        Case: ["Id", "Status"],
        "Earliest Added Accused Officer": [
          "First Name",
          "Middle Name",
          "Last Name",
          "Person Type"
        ],
        "Earliest Added Complainant": [
          "First Name",
          "Middle Name",
          "Last Name",
          "Suffix",
          "Person Type"
        ]
      });
    });

    test("should reformat auditDetails when attributes exist", async () => {
      const auditDetails = {
        cases: {
          attributes: ["id", "status", "incidentDate"]
        },
        complainantCivilians: {
          attributes: ["firstName", "lastName"],
          model: "civilian"
        }
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.auditDetails).toEqual({
        Case: ["Id", "Incident Date", "Status"],
        "Complainant Civilians": ["First Name", "Last Name"]
      });
    });

    test("it should populate auditDetails correctly", async () => {
      const auditDetails = {
        fileName: ["cats.jpg"],
        otherField: ["hello"]
      };

      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      });

      const createdAudit = await models.action_audit.findOne({
        where: { caseId: caseForAudit.id }
      });

      expect(createdAudit.auditDetails).toEqual(auditDetails);
    });

    test("it should populate details correctly for downloaded action with audit details given", async () => {
      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
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
      expect(createdAudits[0].auditDetails).toEqual({
        fileName: ["cats.jpg"]
      });
    });
  });
});
