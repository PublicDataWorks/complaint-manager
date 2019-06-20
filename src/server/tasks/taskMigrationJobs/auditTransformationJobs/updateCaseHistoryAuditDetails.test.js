import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  revertCaseHistoryAuditDetails,
  updateCaseHistoryAuditDetails
} from "./updateCaseHistoryAuditDetails";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";

describe("test update case history audit details", () => {
  const testUser = "Cliff";
  let existingCase;
  beforeEach(async () => {
    existingCase = await createTestCaseWithoutCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("updateCaseHistoryAuditDetails", () => {
    test("should replace Data Change Audit with Legacy Data Change Audit", async () => {
      const auditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: {
          "Action Audit": ["Action", "Created At", "Subject", "User"],
          "Data Change Audit": [
            "Action",
            "Changes",
            "Created At",
            "Model Description",
            "Model Name",
            "User"
          ]
        }
      });

      const secondAuditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: {
          "Action Audit": ["Action", "Created At", "Subject", "User"],
          "Data Change Audit": [
            "Action",
            "Changes",
            "Created At",
            "Model Description",
            "Model Name",
            "User"
          ]
        }
      });

      await updateCaseHistoryAuditDetails();

      const updatedCaseHistoryAudits = await models.action_audit.findAll({});

      expect(updatedCaseHistoryAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.CASE_HISTORY,
            auditDetails: {
              "Action Audit": ["Action", "Created At", "Subject", "User"],
              "Legacy Data Change Audit": [
                "Action",
                "Changes",
                "Created At",
                "Model Description",
                "Model Name",
                "User"
              ]
            },
            createdAt: auditToUpdate.createdAt
          }),
          expect.objectContaining({
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.CASE_HISTORY,
            auditDetails: {
              "Action Audit": ["Action", "Created At", "Subject", "User"],
              "Legacy Data Change Audit": [
                "Action",
                "Changes",
                "Created At",
                "Model Description",
                "Model Name",
                "User"
              ]
            },
            createdAt: secondAuditToUpdate.createdAt
          })
        ])
      );
    });

    test("should not change audit details of old old case history audits", async () => {
      const auditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: [
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
        ]
      });

      await updateCaseHistoryAuditDetails();

      const updatedCaseHistoryAudit = await models.action_audit.findOne({});

      expect(updatedCaseHistoryAudit.toJSON()).toEqual(auditToUpdate.toJSON());
    });
  });

  describe("revertCaseHistoryAuditDetails", () => {
    test("should replace Legacy Data Change Audit with Data Change Audit", async () => {
      const auditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: {
          "Action Audit": ["Action", "Created At", "Subject", "User"],
          "Legacy Data Change Audit": [
            "Action",
            "Changes",
            "Created At",
            "Model Description",
            "Model Name",
            "User"
          ]
        }
      });

      const secondAuditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: {
          "Action Audit": ["Action", "Created At", "Subject", "User"],
          "Legacy Data Change Audit": [
            "Action",
            "Changes",
            "Created At",
            "Model Description",
            "Model Name",
            "User"
          ]
        }
      });

      await revertCaseHistoryAuditDetails();

      const updatedCaseHistoryAudits = await models.action_audit.findAll({});

      expect(updatedCaseHistoryAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.CASE_HISTORY,
            auditDetails: {
              "Action Audit": ["Action", "Created At", "Subject", "User"],
              "Data Change Audit": [
                "Action",
                "Changes",
                "Created At",
                "Model Description",
                "Model Name",
                "User"
              ]
            },
            createdAt: auditToUpdate.createdAt
          }),
          expect.objectContaining({
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.CASE_HISTORY,
            auditDetails: {
              "Action Audit": ["Action", "Created At", "Subject", "User"],
              "Data Change Audit": [
                "Action",
                "Changes",
                "Created At",
                "Model Description",
                "Model Name",
                "User"
              ]
            },
            createdAt: secondAuditToUpdate.createdAt
          })
        ])
      );
    });

    test("should not change audit details of old old case history audits", async () => {
      const auditToUpdate = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails: [
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
        ]
      });

      await revertCaseHistoryAuditDetails();

      const updatedCaseHistoryAudit = await models.action_audit.findOne({});

      expect(updatedCaseHistoryAudit.toJSON()).toEqual(auditToUpdate.toJSON());
    });
  });
});
