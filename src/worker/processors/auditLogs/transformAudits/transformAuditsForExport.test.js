import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_TYPE,
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import transformAuditsForExport from "./transformAuditsForExport";
import formatDate from "../../../../client/utilities/formatDate";
import _ from "lodash";

describe("transformAuditsForExport", () => {
  const user = "Tim Rose";

  test("transform log in audit correctly", () => {
    const audit = {
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: user,
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
        user: user
      }
    ]);
  });

  describe("access audit", () => {
    const testAuditSubject = "Test Audit Subject";
    const caseId = 1;

    test("transform data access where association is referralLetterIaproCorrections correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_ACCESSED,
        user: user,
        createdAt: "Timestamp",
        caseId: caseId,
        updatedAt: new Date(),
        id: 2,
        dataAccessAudit: {
          id: 3,
          auditSubject: testAuditSubject,
          dataAccessValues: [
            {
              id: 4,
              association: "referralLetterIaproCorrections",
              fields: ["field1"]
            }
          ]
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.DATA_ACCESS,
          user: user,
          case_id: caseId,
          snapshot: "Referral Letter IAPro Corrections: Field 1",
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: testAuditSubject,
          created_at: "Timestamp"
        }
      ]);
    });

    test("transform data access correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_ACCESSED,
        user: user,
        createdAt: "Timestamp",
        caseId: caseId,
        updatedAt: new Date(),
        id: 2,
        dataAccessAudit: {
          id: 3,
          auditSubject: testAuditSubject,
          dataAccessValues: [
            {
              id: 4,
              association: "associationName",
              fields: ["field1", "field2", "field3"]
            },
            {
              id: 3,
              association: "anotherAssociationName",
              fields: ["fieldLast"]
            }
          ]
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.DATA_ACCESS,
          user: user,
          case_id: caseId,
          snapshot:
            "Another Association Name: Field Last\n\nAssociation Name: Field 1, Field 2, Field 3",
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: testAuditSubject,
          created_at: "Timestamp"
        }
      ]);
    });
  });

  describe("export audit", () => {
    test("transform export audit log without date range audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: user,
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
          user: user,
          case_id: null,
          snapshot: "Full Audit Log",
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject,
          created_at: "Timestamp"
        }
      ]);
    });
    test("transform export audit log with date range audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: user,
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
          user: user,
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
        user: user,
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
          user: user,
          case_id: null,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.CASE_EXPORT.auditSubject,
          snapshot: "All Cases",
          created_at: "Timestamp"
        }
      ]);
    });

    test("transform export cases audit correctly with date range and type", () => {
      const audit = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: user,
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
          user: user,
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

  describe("file audit", () => {
    test("transforms file download audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DOWNLOADED,
        user: user,
        createdAt: "Timestamp",
        caseId: 12,
        updatedAt: new Date(),
        id: 1,
        fileAudit: {
          id: 2,
          fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
          fileName: "IT'S A TRAP.gif"
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.DATA_ACCESS,
          user: user,
          case_id: 12,
          action: AUDIT_ACTION.DOWNLOADED,
          subject: audit.fileAudit.fileType,
          snapshot: `File Name: ${audit.fileAudit.fileName}`,
          created_at: "Timestamp"
        }
      ]);
    });

    test("transforms file upload audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.UPLOADED,
        user: user,
        createdAt: "Timestamp",
        caseId: 12,
        updatedAt: new Date(),
        id: 1,
        fileAudit: {
          id: 2,
          fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
          fileName: "IT'S A TRAP.gif"
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.UPLOAD,
          user: user,
          case_id: 12,
          action: AUDIT_ACTION.UPLOADED,
          subject: audit.fileAudit.fileType,
          snapshot: `File Name: ${audit.fileAudit.fileName}`,
          created_at: "Timestamp"
        }
      ]);
    });
  });
});
