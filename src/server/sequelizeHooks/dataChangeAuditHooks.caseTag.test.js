import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import Case from "../../client/testUtilities/case";
import models from "../models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import CaseTag from "../../client/testUtilities/caseTag";
import Tag from "../../client/testUtilities/tag";

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

    const audit = await models.data_change_audit.findOne({
      where: { modelName: "Case Tag", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(caseTag.id);
    expect(audit.user).toEqual("A Person");
    expect(audit.modelDescription).toEqual([
      {
        "Tag Name": existingTag.name
      }
    ]);
  });
});
