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
});
