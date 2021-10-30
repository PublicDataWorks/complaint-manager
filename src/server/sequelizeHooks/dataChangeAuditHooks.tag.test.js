import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Tag from "../testHelpers/tag";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks for tag", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  test("creates audit on tag creation", async () => {
    const tagAttributes = new Tag.Builder().defaultTag().withName("Tofu");
    const existingTag = await models.tag.create(tagAttributes, {
      auditUser: "A Person"
    });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "tag"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(null);
    expect(audit.dataChangeAudit.modelId).toEqual(existingTag.id);
    expect(audit.user).toEqual("A Person");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      {
        "New Tag Name": existingTag.name
      }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });
});
