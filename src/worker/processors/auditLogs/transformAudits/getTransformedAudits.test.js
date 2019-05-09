import {
  AUDIT_ACTION,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import models from "../../../../server/models";
import transformAuditsForExport from "./transformAuditsForExport";
import { cleanupDatabase } from "../../../../server/testHelpers/requestTestHelpers";
import getTransformedAudits from "./getTransformedAudits";

jest.mock("./transformAuditsForExport");

describe("getTransformedAudits", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  const job = {
    data: { user: "someone", features: { newAuditFeature: true } }
  };

  test("should include exportAudits", async () => {
    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: "someone",
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
      user: "someone",
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
        user: "someone",
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
});
