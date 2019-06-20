import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Tag from "../../client/testUtilities/tag";
import models from "../models";
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

    const audit = await models.legacy_data_change_audit.findOne({
      where: { modelName: "Tag", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.caseId).toEqual(null);
    expect(audit.modelId).toEqual(existingTag.id);
    expect(audit.user).toEqual("A Person");
    expect(audit.modelDescription).toEqual([
      {
        "New Tag Name": existingTag.name
      }
    ]);
  });
});
