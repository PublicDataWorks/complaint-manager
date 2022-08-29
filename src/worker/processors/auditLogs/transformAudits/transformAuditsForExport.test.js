import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_TYPE,
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import transformAuditsForExport from "./transformAuditsForExport";
import formatDate from "../../../../sharedUtilities/formatDate";
import _ from "lodash";

describe("transformAuditsForExport", () => {
  const user = "Tim Rose";

  test("transform log in audit correctly", () => {
    const audit = {
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: user,
      createdAt: "Timestamp",
      referenceId: null,
      managerType: "complaint",
      updatedAt: new Date(),
      id: 1
    };

    expect(transformAuditsForExport([audit])).toEqual([
      {
        action: AUDIT_ACTION.LOGGED_IN,
        reference_id: null,
        manager_type: "complaint",
        audit_type: AUDIT_TYPE.AUTHENTICATION,
        created_at: "Timestamp",
        user: user
      }
    ]);
  });

  describe("access audit", () => {
    const testAuditSubject = "Test Audit Subject";
    const caseId = 1;

    test("transform data access correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_ACCESSED,
        user: user,
        createdAt: "Timestamp",
        referenceId: caseId,
        managerType: "complaint",
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
          reference_id: caseId,
          manager_type: "complaint",
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
        referenceId: null,
        managerType: "complaint",
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
          reference_id: null,
          manager_type: "complaint",
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
        referenceId: null,
        managerType: "complaint",
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
          reference_id: null,
          manager_type: "complaint",
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
        referenceId: null,
        managerType: "complaint",
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
          reference_id: null,
          manager_type: "complaint",
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
        referenceId: null,
        managerType: "complaint",
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
          reference_id: null,
          manager_type: "complaint",
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
        referenceId: 12,
        managerType: "complaint",
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
          reference_id: 12,
          manager_type: "complaint",
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
        referenceId: 12,
        managerType: "complaint",
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
          reference_id: 12,
          manager_type: "complaint",
          action: AUDIT_ACTION.UPLOADED,
          subject: audit.fileAudit.fileType,
          snapshot: `File Name: ${audit.fileAudit.fileName}`,
          created_at: "Timestamp"
        }
      ]);
    });
  });

  test("transforms default audit correctly", () => {
    const audit = {
      auditAction: "Something else entirely",
      user: user,
      createdAt: "Timestamp",
      referenceId: 12,
      managerType: "complaint",
      updatedAt: new Date(),
      id: 1
    };

    expect(transformAuditsForExport([audit])).toEqual([
      {
        audit_type: "",
        user: user,
        reference_id: 12,
        manager_type: "complaint",
        action: "Something else entirely",
        created_at: "Timestamp"
      }
    ]);
  });

  describe("data change audit", () => {
    const testModelName = "achoo";
    const testModelDescription = [{ naZdrowie: "Pani Krowie" }];
    const expectedSnapshot = `Na Zdrowie: Pani Krowie\n\n\nName: Flower\nAge: 32\n${_.startCase(
      testModelName
    )} Id: 525600`;

    test("transforms updated data change audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: user,
        createdAt: "Timestamp",
        referenceId: 12,
        managerType: "complaint",
        updatedAt: new Date(),
        id: 1,
        dataChangeAudit: {
          modelName: testModelName,
          modelDescription: testModelDescription,
          modelId: 90,
          snapshot: {
            name: "Flower",
            age: 32,
            id: 525600
          },
          changes: {
            details: { new: "New Details", previous: "Old Details" }
          }
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.DATA_CHANGE,
          user: user,
          reference_id: 12,
          manager_type: "complaint",
          action: AUDIT_ACTION.DATA_UPDATED,
          subject: _.startCase(testModelName),
          snapshot: expectedSnapshot,
          created_at: "Timestamp",
          changes: `Details changed from 'Old Details' to 'New Details'`,
          subject_id: 90
        }
      ]);
    });

    test("transforms created data change audit correctly and excludes changes", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_CREATED,
        dataChangeAudit: {
          modelName: testModelName,
          modelDescription: testModelDescription,
          modelId: 90,
          changes: {
            details: {
              new: "New Details"
            },
            otherDetails: { new: "New new" }
          },
          snapshot: {
            name: "Flower",
            age: 32,
            id: 525600
          }
        }
      };

      const expectedSnapshot = `Na Zdrowie: Pani Krowie\n\n\nName: Flower\nAge: 32\n${_.startCase(
        testModelName
      )} Id: 525600`;

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.DATA_CREATED,
          audit_type: AUDIT_TYPE.DATA_CHANGE,
          snapshot: expectedSnapshot,
          subject_id: 90
        })
      );
      expect(transformedAudit.changes).toBeUndefined();
    });

    test("transform deleted data change audit correctly and excludes changes", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_DELETED,
        dataChangeAudit: {
          modelName: testModelName,
          modelDescription: testModelDescription,
          modelId: 90,
          changes: {
            details: {
              previous: "Previous Details",
              new: ""
            },
            otherDetails: { prev: "Previous Details", new: "" }
          },
          snapshot: {
            name: "Flower",
            age: 32,
            id: 525600
          }
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.DATA_DELETED,
          audit_type: AUDIT_TYPE.DATA_CHANGE,
          snapshot: expectedSnapshot,
          subject_id: 90
        })
      );
      expect(transformedAudit.changes).toBeUndefined();
    });

    test("transform restored data change audit correctly and excludes changes", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_RESTORED,
        dataChangeAudit: {
          modelName: testModelName,
          modelDescription: testModelDescription,
          modelId: 90,
          changes: {
            details: {
              new: "Deets"
            },
            otherDetails: { new: "Dee tails" }
          },
          snapshot: {
            name: "Flower",
            age: 32,
            id: 525600
          }
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.DATA_RESTORED,
          audit_type: AUDIT_TYPE.DATA_CHANGE,
          snapshot: expectedSnapshot,
          subject_id: 90
        })
      );
      expect(transformedAudit.changes).toBeUndefined();
    });

    test("transform archived data change audit correctly and excludes changes", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_ARCHIVED,
        dataChangeAudit: {
          modelName: testModelName,
          modelDescription: testModelDescription,
          modelId: 90,
          changes: {
            details: {
              previous: "Deets"
            },
            otherDetails: { previous: "Dee tails" }
          },
          snapshot: {
            name: "Flower",
            age: 32,
            id: 525600
          }
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.DATA_ARCHIVED,
          audit_type: AUDIT_TYPE.DATA_CHANGE,
          snapshot: expectedSnapshot,
          subject_id: 90
        })
      );
      expect(transformedAudit.changes).toBeUndefined();
    });

    test("strips html tags from changes field", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          changes: {
            details: {
              previous: "<p>text <b>nested</b></p>",
              new: "<div>notes <ul><li>one</li><li>two</li></ul> more</div>"
            }
          }
        }
      };
      const transformedAudit = transformAuditsForExport([audit])[0];
      expect(transformedAudit.changes).toEqual(
        "Details changed from 'text nested' to 'notes onetwo more'"
      );
    });

    test("preserves boolean values in changes and snapshot", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          changes: {
            details: { previous: true, new: false },
            otherDetails: { previous: undefined, new: "" },
            moreDetails: { previous: null, new: "" }
          },
          snapshot: { one: true, two: false }
        }
      };
      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          changes:
            "Details changed from 'true' to 'false'\nOther Details changed from '' to ''\nMore Details changed from '' to ''",
          snapshot: "One: true\nTwo: false"
        })
      );
    });

    test("transforms snapshot field when there is a model description", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          snapshot: {
            name: "Bob Smith",
            age: 50,
            id: 392
          },
          modelName: "cases",
          modelDescription: [{ tis: "a" }, { model: "description" }],
          modelId: 90
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          snapshot:
            "Tis: a\nModel: description\n\n\nName: Bob Smith\nAge: 50\nCase Id: 392",
          subject_id: 90
        })
      );
    });

    test("strips html tags from snapshot field", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          snapshot: {
            note: "<p>Bob Smith <b>really</b> is interesting</b>"
          },
          modelDescription: []
        }
      };
      const transformedAudit = transformAuditsForExport([audit])[0];
      expect(transformedAudit.snapshot).toEqual(
        "Note: Bob Smith really is interesting"
      );
    });

    test("transforms snapshot field when there is no model description", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          modelName: "cases",
          snapshot: {
            name: "Bob Smith",
            age: 50,
            id: 392
          },
          modelDescription: ""
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          snapshot: "Name: Bob Smith\nAge: 50\nCase Id: 392"
        })
      );
    });

    test("excludes objects, arrays, nulls, createdAt, updatedAt, deletedAt and AddressableType from snapshot", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        dataChangeAudit: {
          snapshot: {
            id: 392,
            addressableId: 5,
            addressableType: ADDRESSABLE_TYPE.CIVILIAN,
            civilian: { name: "John" },
            createdAt: "2018-01-01 12:12:00",
            updatedAt: "2018-01-01 12:12:00",
            deletedAt: "2018-01-01 12:14:00",
            allegations: ["one", "two"],
            nullField: null,
            isSomething: true
          },
          modelName: "cases"
        }
      };

      const transformedAudit = transformAuditsForExport([audit])[0];

      expect(transformedAudit).toEqual(
        expect.objectContaining({
          snapshot: "Case Id: 392\nAddressable Id: 5\nIs Something: true"
        })
      );
    });
  });

  describe("legacy data access audit", () => {
    test("transforms legacy data access audit correctly", () => {
      const audit = {
        auditAction: AUDIT_ACTION.DATA_ACCESSED,
        user: user,
        createdAt: "Timestamp",
        referenceId: 12,
        managerType: "complaint",
        updatedAt: new Date(),
        id: 1,
        legacyDataAccessAudit: {
          id: 3,
          auditSubject: "Test Subject",
          auditDetails: [
            "Case Information",
            "Civilian Complainants",
            "Officer Complainants",
            "Accused Officers"
          ]
        }
      };

      expect(transformAuditsForExport([audit])).toEqual([
        {
          audit_type: AUDIT_TYPE.DATA_ACCESS,
          user: user,
          reference_id: 12,
          manager_type: "complaint",
          snapshot:
            "Case Information, Civilian Complainants, Officer Complainants, Accused Officers",
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: "Test Subject",
          created_at: "Timestamp"
        }
      ]);
    });
  });
});
