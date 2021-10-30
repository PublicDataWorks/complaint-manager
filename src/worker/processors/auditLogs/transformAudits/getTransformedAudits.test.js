import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import models from "../../../../server/policeDataManager/models";
import transformAuditsForExport from "./transformAuditsForExport";
import { cleanupDatabase } from "../../../../server/testHelpers/requestTestHelpers";
import getTransformedAudits from "./getTransformedAudits";

jest.mock("./transformAuditsForExport");

describe("getTransformedAudits", () => {
  const testUser = "Jar Jar Binks";

  beforeEach(() => {
    transformAuditsForExport.mockClear();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });
  const job = {
    data: { user: testUser }
  };

  test("should include exportAudits", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: testUser,
      managerType: "complaint",
      exportAudit: {
        exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name
      }
    };
    await models.audit.create(auditValues, {
      include: [{ model: models.export_audit, as: "exportAudit" }]
    });

    await getTransformedAudits({});

    expect(transformAuditsForExport).toHaveBeenCalledWith([
      expect.objectContaining({
        auditAction: auditValues.auditAction,
        exportAudit: expect.objectContaining({
          exportType: auditValues.exportAudit.exportType
        })
      })
    ]);
  });

  test("should batch audit query based on configuration", async () => {
    const audits = [
      {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: testUser,
        managerType: "complaint"
      },
      {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: testUser,
        managerType: "complaint"
      },
      {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: testUser,
        managerType: "complaint"
      },
      {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: testUser,
        managerType: "complaint"
      },
      {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: testUser,
        managerType: "complaint"
      }
    ];

    await models.audit.bulkCreate(audits);

    await getTransformedAudits({}, 1);

    expect(transformAuditsForExport.mock.calls.length).toBe(5);
  });

  test("should include data access audit and data access values", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: testUser,
      managerType: "complaint",
      dataAccessAudit: {
        auditSubject: "test subject",
        dataAccessValues: [
          {
            association: "specialAssociation",
            fields: ["itsAField", "heyLookAnotherField", "itsNotSupermanField"]
          }
        ]
      }
    };
    await models.audit.create(auditValues, {
      include: [
        {
          model: models.data_access_audit,
          as: "dataAccessAudit",
          include: [
            {
              model: models.data_access_value,
              as: "dataAccessValues"
            }
          ]
        }
      ]
    });

    await getTransformedAudits({});

    expect(transformAuditsForExport).toHaveBeenCalledWith([
      expect.objectContaining({
        auditAction: auditValues.auditAction,
        user: testUser,
        dataAccessAudit: expect.objectContaining({
          auditSubject: auditValues.dataAccessAudit.auditSubject,
          dataAccessValues: [
            expect.objectContaining({
              association:
                auditValues.dataAccessAudit.dataAccessValues[0].association,
              fields: auditValues.dataAccessAudit.dataAccessValues[0].fields
            })
          ]
        })
      })
    ]);
  });

  test("should include file audit", async () => {
    const fileName = "theStoryOfDarthPlagueisTheWise.rtf";
    const auditValues = {
      auditAction: AUDIT_ACTION.DOWNLOADED,
      user: testUser,
      managerType: "complaint",
      fileAudit: {
        fileName: fileName,
        fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF
      }
    };
    await models.audit.create(auditValues, {
      include: [
        {
          as: "fileAudit",
          model: models.file_audit
        }
      ]
    });

    await getTransformedAudits({});

    expect(transformAuditsForExport).toHaveBeenCalledWith([
      expect.objectContaining({
        auditAction: auditValues.auditAction,
        user: testUser,
        fileAudit: expect.objectContaining({
          fileName: fileName,
          fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF
        })
      })
    ]);
  });

  test("should include data change audits", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.DATA_CREATED,
      user: testUser,
      managerType: "complaint",
      dataChangeAudit: {
        modelName: "test model name",
        modelDescription: "test model description",
        modelId: 90,
        snapshot: {},
        changes: {}
      }
    };

    await models.audit.create(auditValues, {
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit
        }
      ]
    });

    await getTransformedAudits({});

    expect(transformAuditsForExport).toHaveBeenCalledWith([
      expect.objectContaining({
        auditAction: auditValues.auditAction,
        user: testUser,
        dataChangeAudit: expect.objectContaining({
          modelName: "test model name",
          modelDescription: "test model description",
          modelId: 90,
          snapshot: {},
          changes: {}
        })
      })
    ]);
  });

  test("should include legacy data access audits", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.DATA_CREATED,
      user: testUser,
      managerType: "complaint",
      legacyDataAccessAudit: {
        auditSubject: AUDIT_SUBJECT.CASE_DETAILS,
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
          "Attachments"
        ]
      }
    };

    await models.audit.create(auditValues, {
      include: [
        {
          as: "legacyDataAccessAudit",
          model: models.legacy_data_access_audit
        }
      ]
    });

    await getTransformedAudits({});

    expect(transformAuditsForExport).toHaveBeenCalledWith([
      expect.objectContaining({
        auditAction: auditValues.auditAction,
        user: testUser,
        legacyDataAccessAudit: expect.objectContaining({
          auditSubject: auditValues.legacyDataAccessAudit.auditSubject,
          auditDetails: auditValues.legacyDataAccessAudit.auditDetails
        })
      })
    ]);
  });
});
