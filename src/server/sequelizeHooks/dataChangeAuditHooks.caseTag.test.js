import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Case from "../../sharedTestHelpers/case";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import CaseTag from "../testHelpers/caseTag";
import Tag from "../testHelpers/tag";

describe("dataChangeAuditHooks for caseTag", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("creates audit on caseTag creation", async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    const existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const tagAttributes = new Tag.Builder().defaultTag();
    const existingTag = await models.tag.create(tagAttributes, {
      auditUser: "A Person"
    });

    const caseTagAttributes = new CaseTag.Builder()
      .defaultCaseTag()
      .withCaseId(existingCase.id)
      .withTagId(existingTag.id);
    const caseTag = await models.case_tag.create(caseTagAttributes, {
      auditUser: "A Person"
    });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "case_tag"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(caseTag.id);
    expect(audit.user).toEqual("A Person");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      {
        "Tag Name": existingTag.name
      }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });
});
