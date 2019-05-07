import models from "../../models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";
import moment from "moment";
import {
  transformNewAuthenticationAuditsToOld,
  transformOldAuthenticationAuditsToNew
} from "./transformAuthenticationAudits";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

describe("transform authorization audits", () => {
  const logInCreatedAtTime = moment("2018-01-01 00:00:00");
  const logOutCreatedAtTime = moment("2018-01-01 00:12:00");
  const nonAuthenticationAuditTime = moment("2018-06-01 00:05:36");

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("transformOldAuthenticationAuditsToNew", () => {
    test("should correctly create new audits based on old audit table", async () => {
      const oldLogInAuditRecord = await models.action_audit.create({
        auditType: AUDIT_TYPE.AUTHENTICATION,
        action: AUDIT_ACTION.LOGGED_IN,
        caseId: null,
        user: "Test User",
        createdAt: logInCreatedAtTime
      });

      const oldLogOutAuditRecord = await models.action_audit.create({
        auditType: AUDIT_TYPE.AUTHENTICATION,
        action: AUDIT_ACTION.LOGGED_OUT,
        caseId: null,
        user: "Test User",
        createdAt: logOutCreatedAtTime
      });

      const nonAuthenticationAuditRecord = await models.action_audit.create({
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DATA_ACCESSED,
        caseId: null,
        user: "Someone Else",
        createdAt: nonAuthenticationAuditTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformOldAuthenticationAuditsToNew(transaction);
      });

      const newAuthenticationAuditRecords = await models.audit.findAll();

      expect(newAuthenticationAuditRecords.length).toEqual(2);
      expect(newAuthenticationAuditRecords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            auditAction: oldLogInAuditRecord.action,
            user: oldLogInAuditRecord.user,
            createdAt: oldLogInAuditRecord.createdAt
          }),
          expect.objectContaining({
            auditAction: oldLogOutAuditRecord.action,
            user: oldLogOutAuditRecord.user,
            createdAt: oldLogOutAuditRecord.createdAt
          })
        ])
      );
    });
  });

  describe("transformNewAuthenticationAuditsToOld", () => {
    test("should create old audits from new audits", async () => {
      const newLogInAudit = await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "test",
        createdAt: logInCreatedAtTime
      });

      const newLogOutAudit = await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_OUT,
        user: "test",
        createdAt: logOutCreatedAtTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformNewAuthenticationAuditsToOld(transaction);
      });

      const oldAuthenticationAudits = await models.action_audit.findAll();

      expect(oldAuthenticationAudits.length).toEqual(2);
      expect(oldAuthenticationAudits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: newLogInAudit.auditAction,
            auditType: AUDIT_TYPE.AUTHENTICATION,
            user: newLogInAudit.user,
            caseId: null,
            subject: null,
            auditDetails: null,
            createdAt: newLogInAudit.createdAt
          }),
          expect.objectContaining({
            action: newLogOutAudit.auditAction,
            auditType: AUDIT_TYPE.AUTHENTICATION,
            user: newLogOutAudit.user,
            caseId: null,
            subject: null,
            auditDetails: null,
            createdAt: newLogOutAudit.createdAt
          })
        ])
      );
    });

    test("should not create an old audit record if it already exists", async () => {
      const duplicateCreatedAtTime = moment("2018-08-22 23:30:00");
      const aPersonAuditCreatedAtTime = moment("2018-05-12 00:00:00");

      const differentPersonAudit = await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "B Person",
        createdAt: duplicateCreatedAtTime
      });
      const differentTimeAudit = await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "A Person",
        createdAt: aPersonAuditCreatedAtTime
      });
      const differentActionAudit = await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_OUT,
        user: "A Person",
        createdAt: duplicateCreatedAtTime
      });

      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "A Person",
        createdAt: duplicateCreatedAtTime
      });
      const existingOldLogOutAudit = await models.action_audit.create({
        auditType: AUDIT_TYPE.AUTHENTICATION,
        action: AUDIT_ACTION.LOGGED_IN,
        caseId: null,
        user: "A Person",
        createdAt: duplicateCreatedAtTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformNewAuthenticationAuditsToOld(transaction);
      });

      const oldAuthenticationAudits = await models.action_audit.findAll();

      expect(oldAuthenticationAudits.length).toEqual(4);
      expect(oldAuthenticationAudits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: differentPersonAudit.auditAction,
            auditType: AUDIT_TYPE.AUTHENTICATION,
            user: differentPersonAudit.user,
            caseId: differentPersonAudit.caseId,
            subject: null,
            auditDetails: null,
            createdAt: differentPersonAudit.createdAt
          }),
          expect.objectContaining({
            action: differentTimeAudit.auditAction,
            auditType: AUDIT_TYPE.AUTHENTICATION,
            user: differentTimeAudit.user,
            caseId: differentTimeAudit.caseId,
            subject: null,
            auditDetails: null,
            createdAt: differentTimeAudit.createdAt
          }),
          expect.objectContaining({
            action: differentActionAudit.auditAction,
            auditType: AUDIT_TYPE.AUTHENTICATION,
            user: differentActionAudit.user,
            caseId: differentActionAudit.caseId,
            subject: null,
            auditDetails: null,
            createdAt: differentActionAudit.createdAt
          }),
          expect.objectContaining({
            action: existingOldLogOutAudit.action,
            auditType: existingOldLogOutAudit.auditType,
            user: existingOldLogOutAudit.user,
            caseId: existingOldLogOutAudit.caseId,
            subject: existingOldLogOutAudit.subject,
            auditDetails: existingOldLogOutAudit.auditDetails,
            createdAt: existingOldLogOutAudit.createdAt
          })
        ])
      );
    });
  });
});
