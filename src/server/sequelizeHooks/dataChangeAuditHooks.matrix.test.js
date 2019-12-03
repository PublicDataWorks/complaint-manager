import models from "../matrixManager/models/index";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import Matrix from "../../client/complaintManager/testUtilities/Matrix";

describe("dataChangeAuditHooks", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("create matrix", () => {
    let initialMatrixAttributes = {};

    beforeEach(async () => {
      initialMatrixAttributes = new Matrix.Builder()
        .defaultMatrix()
        .withId(undefined);
    });

    test("creates an audit entry for the matrix creation with the basic attributes", async () => {
      const createdMatrix = await models.matrices.create(
        initialMatrixAttributes,
        {
          auditUser: "Neo"
        }
      );

      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "matrices"
            }
          }
        ]
      });

      expect(audit.dataChangeAudit.modelName).toEqual("matrices");
      expect(audit.dataChangeAudit.modelId).toEqual(createdMatrix.id);
      expect(audit.auditAction).toEqual(AUDIT_ACTION.DATA_CREATED);
      expect(audit.user).toEqual("Neo");
      expect(audit.managerType).toEqual("matrix");
    });
  });
});
