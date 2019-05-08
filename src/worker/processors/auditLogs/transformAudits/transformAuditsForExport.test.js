import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import transformAuditsForExport from "./transformAuditsForExport";
import formatDate from "../../../../client/utilities/formatDate";
import _ from "lodash";

describe("transformAuditsForExport", () => {
  test("transform log in audit correctly", () => {
    const audit = {
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: "someone",
      createdAt: "Timestamp",
      caseId: null,
      updatedAt: new Date(),
      id: 1
    };

    expect(transformAuditsForExport([audit])).toEqual([
      {
        action: AUDIT_ACTION.LOGGED_IN,
        case_id: null,
        audit_type: AUDIT_TYPE.AUTHENTICATION,
        created_at: "Timestamp",
        user: "someone"
      }
    ]);
  });

  describe("export audit", () => {
    test("transform export audit log without date range audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: "someone",
        createdAt: "Timestamp",
        caseId: null,
        updatedAt: new Date(),
        id: 1,
        exportAudit: {
          id: 2,
          exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
          rangeType: null,
          rangeStart: null,
          rangeEnd: null
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.EXPORT,
          user: "someone",
          case_id: null,
          snapshot: null,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject,
          created_at: "Timestamp"
        }
      ]);
    });
    test("transform export audit log with date range audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: "someone",
        createdAt: "Timestamp",
        caseId: null,
        updatedAt: new Date(),
        id: 1,
        exportAudit: {
          id: 2,
          exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
          rangeType: null,
          rangeStart: "2011-12-21",
          rangeEnd: "2012-12-21"
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.EXPORT,
          user: "someone",
          case_id: null,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject,
          snapshot: "Export Range: Dec 21, 2011 to Dec 21, 2012",
          created_at: "Timestamp"
        }
      ]);
    });

    test("transform export cases audit correctly without date range or type", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: "someone",
        createdAt: "Timestamp",
        caseId: null,
        updatedAt: new Date(),
        id: 1,
        exportAudit: {
          id: 2,
          exportType: JOB_OPERATION.CASE_EXPORT.name,
          rangeType: null
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.EXPORT,
          user: "someone",
          case_id: null,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.CASE_EXPORT.auditSubject,
          snapshot: null,
          created_at: "Timestamp"
        }
      ]);
    });

    test("transform export cases audit correctly with date range and type", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: "someone",
        createdAt: "Timestamp",
        caseId: null,
        updatedAt: new Date(),
        id: 1,
        exportAudit: {
          id: 2,
          exportType: JOB_OPERATION.CASE_EXPORT.name,
          rangeType: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE,
          rangeStart: "2011-12-21",
          rangeEnd: "2012-12-21"
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.EXPORT,
          user: "someone",
          case_id: null,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.CASE_EXPORT.auditSubject,
          snapshot: `Date Type: ${_.startCase(
            audit.exportAudit.rangeType
          )}\nExport Range: ${formatDate(
            audit.exportAudit.rangeStart
          )} to ${formatDate(audit.exportAudit.rangeEnd)}`,
          created_at: "Timestamp"
        }
      ]);
    });
  });
});
