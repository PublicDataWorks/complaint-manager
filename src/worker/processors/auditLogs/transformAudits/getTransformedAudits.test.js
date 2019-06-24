import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import models from "../../../../server/models";
import transformAuditsForExport from "./transformAuditsForExport";
import { cleanupDatabase } from "../../../../server/testHelpers/requestTestHelpers";
import getTransformedAudits from "./getTransformedAudits";

jest.mock("./transformAuditsForExport");

describe("getTransformedAudits", () => {
  const testUser = "Jar Jar Binks";

  afterEach(async () => {
    await cleanupDatabase();
  });
  const job = {
    data: { user: testUser, features: { newAuditFeature: true } }
  };

  test("should include exportAudits", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: testUser,
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

  test("should include data access audit and data access values", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: testUser,
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
});
