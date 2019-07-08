import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import _ from "lodash";
import {
  transformNewExportAuditsToOld,
  transformOldExportAuditsToNew
} from "./transformExportAudits";
import moment from "moment";
import formatDate from "../../../../client/utilities/formatDate";

describe("transform export audits", () => {
  const createdAtTime = moment("2016-03-15 05:12:12");
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("transformOldExportAuditsToNew", () => {
    test("should correctly create new audits based on old export audits", async () => {
      const oldAuditLogExportWithoutDate = await models.action_audit.create({
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        caseId: null,
        user: "George",
        subject: AUDIT_SUBJECT.AUDIT_LOG,
        auditDetails: null,
        createdAt: createdAtTime
      });

      const oldAuditLogExportWithDate = await models.action_audit.create({
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        caseId: null,
        user: "George",
        subject: AUDIT_SUBJECT.AUDIT_LOG,
        auditDetails: {
          ["Export Range"]: ["Jan 1, 2014 to Jan 9, 2014"]
        },
        createdAt: createdAtTime.add(1, "days")
      });

      const oldCaseExportWithoutDate = await models.action_audit.create({
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        caseId: null,
        user: "George",
        subject: AUDIT_SUBJECT.CASE_EXPORT,
        auditDetails: null,
        createdAt: createdAtTime.add(2, "days")
      });

      const oldCaseExportWithDate = await models.action_audit.create({
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        caseId: null,
        user: "George",
        subject: AUDIT_SUBJECT.CASE_EXPORT,
        auditDetails: {
          ["Date Type"]: [_.startCase(CASE_EXPORT_TYPE.INCIDENT_DATE)],
          ["Export Range"]: ["Jan 1, 2014 to Jan 9, 2014"]
        },
        createdAt: createdAtTime.add(3, "days")
      });

      await models.sequelize.transaction(async transaction => {
        await transformOldExportAuditsToNew(transaction);
      });

      const newExportAuditRecords = await models.audit.findAll({
        include: [
          {
            model: models.export_audit,
            as: "exportAudit"
          }
        ]
      });

      expect(newExportAuditRecords.length).toEqual(4);
      expect(newExportAuditRecords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            auditAction: oldAuditLogExportWithoutDate.action,
            user: oldAuditLogExportWithoutDate.user,
            createdAt: oldAuditLogExportWithoutDate.createdAt,
            exportAudit: expect.objectContaining({
              exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
              rangeType: null,
              rangeStart: null,
              rangeEnd: null
            })
          }),
          expect.objectContaining({
            auditAction: oldAuditLogExportWithDate.action,
            user: oldAuditLogExportWithDate.user,
            createdAt: oldAuditLogExportWithDate.createdAt,
            exportAudit: expect.objectContaining({
              exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
              rangeType: null,
              rangeStart: "2014-01-01",
              rangeEnd: "2014-01-09"
            })
          }),
          expect.objectContaining({
            auditAction: oldCaseExportWithoutDate.action,
            user: oldCaseExportWithoutDate.user,
            createdAt: oldCaseExportWithoutDate.createdAt,
            exportAudit: expect.objectContaining({
              exportType: JOB_OPERATION.CASE_EXPORT.name,
              rangeType: null,
              rangeStart: null,
              rangeEnd: null
            })
          }),
          expect.objectContaining({
            auditAction: oldCaseExportWithDate.action,
            user: oldCaseExportWithDate.user,
            createdAt: oldCaseExportWithDate.createdAt,
            exportAudit: expect.objectContaining({
              exportType: JOB_OPERATION.CASE_EXPORT.name,
              rangeType: CASE_EXPORT_TYPE.INCIDENT_DATE,
              rangeStart: "2014-01-01",
              rangeEnd: "2014-01-09"
            })
          })
        ])
      );
    });
  });

  describe("transformNewExportAuditsToOld", () => {
    const userYoko = "Yoko";
    test("should create old action audits from new export audits", async () => {
      const newAuditLogExportWithoutDate = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: userYoko,
          createdAt: createdAtTime,
          exportAudit: {
            exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );
      const newAuditLogExportWithDate = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: userYoko,
          createdAt: createdAtTime.add(1, "days"),
          exportAudit: {
            exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
            rangeStart: "2014-01-01",
            rangeEnd: "2014-01-09"
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );
      const newCaseExportWithoutDate = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: userYoko,
          createdAt: createdAtTime.add(2, "days"),
          exportAudit: {
            exportType: JOB_OPERATION.CASE_EXPORT.name
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );
      const newCaseExportWithDate = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: userYoko,
          createdAt: createdAtTime.add(3, "days"),
          exportAudit: {
            exportType: JOB_OPERATION.CASE_EXPORT.name,
            rangeType: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE,
            rangeStart: "2014-01-01",
            rangeEnd: "2014-01-09"
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );

      await models.sequelize.transaction(async transaction => {
        await transformNewExportAuditsToOld(transaction);
      });

      const oldExportAudits = await models.action_audit.findAll();
      const newExportAudits = await models.export_audit.findAll();
      const newAudits = await models.audit.findAll();

      expect(oldExportAudits.length).toEqual(4);
      expect(newExportAudits.length).toEqual(0);
      expect(newAudits.length).toEqual(0);
      expect(oldExportAudits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: newAuditLogExportWithoutDate.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: newAuditLogExportWithoutDate.user,
            caseId: null,
            subject:
              JOB_OPERATION[newAuditLogExportWithoutDate.exportAudit.exportType]
                .auditSubject,
            auditDetails: null,
            createdAt: newAuditLogExportWithoutDate.createdAt
          }),
          expect.objectContaining({
            action: newAuditLogExportWithDate.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: newAuditLogExportWithDate.user,
            caseId: null,
            subject:
              JOB_OPERATION[newAuditLogExportWithDate.exportAudit.exportType]
                .auditSubject,
            auditDetails: {
              ["Export Range"]: [
                `${formatDate(
                  newAuditLogExportWithDate.exportAudit.rangeStart
                )} to ${formatDate(
                  newAuditLogExportWithDate.exportAudit.rangeEnd
                )}`
              ]
            },
            createdAt: newAuditLogExportWithDate.createdAt
          }),
          expect.objectContaining({
            action: newCaseExportWithoutDate.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: newCaseExportWithoutDate.user,
            caseId: null,
            subject:
              JOB_OPERATION[newCaseExportWithoutDate.exportAudit.exportType]
                .auditSubject,
            auditDetails: null,
            createdAt: newCaseExportWithoutDate.createdAt
          }),
          expect.objectContaining({
            action: newCaseExportWithDate.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: newCaseExportWithDate.user,
            caseId: null,
            subject:
              JOB_OPERATION[newCaseExportWithDate.exportAudit.exportType]
                .auditSubject,
            auditDetails: {
              ["Date Type"]: [
                _.startCase(newCaseExportWithDate.exportAudit.rangeType)
              ],
              ["Export Range"]: [
                `${formatDate(
                  newCaseExportWithDate.exportAudit.rangeStart
                )} to ${formatDate(newCaseExportWithDate.exportAudit.rangeEnd)}`
              ]
            },
            createdAt: newCaseExportWithDate.createdAt
          })
        ])
      );
    });

    test("should not create an old audit record if it already exists", async () => {
      const duplicateCreatedAtTime = moment("2018-08-22 23:30:00");
      const aPersonAuditCreatedAtTime = moment("2018-05-12 00:00:00");

      const duplicateAudit = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: "A Person",
          createdAt: duplicateCreatedAtTime,
          exportAudit: {
            exportType: JOB_OPERATION.CASE_EXPORT.name
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );

      const differentUser = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: userYoko,
          createdAt: duplicateCreatedAtTime,
          exportAudit: {
            exportType: JOB_OPERATION.CASE_EXPORT.name
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );

      const differentTime = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.EXPORTED,
          user: "A Person",
          createdAt: aPersonAuditCreatedAtTime,
          exportAudit: {
            exportType: JOB_OPERATION.CASE_EXPORT.name
          }
        },
        { include: [{ model: models.export_audit, as: "exportAudit" }] }
      );

      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "A Person",
        createdAt: duplicateCreatedAtTime
      });

      const existingActionAudit = await models.action_audit.create({
        action: AUDIT_ACTION.EXPORTED,
        auditType: AUDIT_TYPE.EXPORT,
        user: "A Person",
        createdAt: duplicateCreatedAtTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformNewExportAuditsToOld(transaction);
      });

      const oldExportAudits = await models.action_audit.findAll();
      const newAudits = await models.audit.findAll();

      expect(newAudits.length).toEqual(1);
      expect(oldExportAudits.length).toEqual(3);
      expect(oldExportAudits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: existingActionAudit.action,
            auditType: existingActionAudit.auditType,
            user: existingActionAudit.user,
            caseId: existingActionAudit.caseId,
            subject: existingActionAudit.subject,
            auditDetails: existingActionAudit.auditDetails,
            createdAt: existingActionAudit.createdAt
          }),
          expect.objectContaining({
            action: differentTime.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: differentTime.user,
            caseId: null,
            subject:
              JOB_OPERATION[differentTime.exportAudit.exportType].auditSubject,
            auditDetails: null,
            createdAt: differentTime.createdAt
          }),
          expect.objectContaining({
            action: differentUser.auditAction,
            auditType: AUDIT_TYPE.EXPORT,
            user: differentUser.user,
            caseId: null,
            subject:
              JOB_OPERATION[differentUser.exportAudit.exportType].auditSubject,
            auditDetails: null,
            createdAt: differentUser.createdAt
          })
        ])
      );
    });
  });
});
