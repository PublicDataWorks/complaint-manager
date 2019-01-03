import ActionAudit from "../../../client/testUtilities/ActionAudit";
import { AUDIT_TYPE } from "../../../sharedUtilities/constants";

const transformActionAuditForExport = require("./transformActionAuditForExport");

describe("transformActionAuditForExport", () => {
  test("snapshot is blank if subject details are null", () => {
    const authAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .build();

    const transformedAudits = transformActionAuditForExport([authAction]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([expect.objectContaining({ snapshot: "" })])
    );
  });

  test("snapshot displays array contents if subject details is array", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubjectDetails(["model1", "model2"]);

    const transformedAudits = transformActionAuditForExport([
      actionAuditAttributes
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ snapshot: "model1, model2" })
      ])
    );
  });

  test("snapshot formats subject details when object", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubjectDetails({ fileName: "cats.jpg", description: "Cute cats" });

    const transformedAudits = transformActionAuditForExport([
      actionAuditAttributes
    ]);

    expect(transformedAudits[0]["snapshot"]).toEqual(
      "File Name: cats.jpg, Description: Cute cats"
    );
  });
});
