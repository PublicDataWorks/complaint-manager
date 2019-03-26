import ActionAudit from "../../../client/testUtilities/ActionAudit";
import { AUDIT_SUBJECT, AUDIT_TYPE } from "../../../sharedUtilities/constants";

const transformActionAuditsForExport = require("./transformActionAuditsForExport");

describe("transformActionAuditsForExport", () => {
  test("snapshot is blank if audit details are null", () => {
    const authAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .build();

    const transformedAudits = transformActionAuditsForExport([authAction]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([expect.objectContaining({ snapshot: "" })])
    );
  });

  test("snapshot displays array contents if audit details is array", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withAuditDetails(["model1", "model2"]);

    const transformedAudits = transformActionAuditsForExport([
      actionAuditAttributes
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ snapshot: "model1, model2" })
      ])
    );
  });

  test("snapshot formats audit details when object", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.ATTACHMENT)
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withAuditDetails({
        fileName: ["cats.jpg"],
        description: ["Cute cats"]
      });

    const transformedAudits = transformActionAuditsForExport([
      actionAuditAttributes
    ]);

    expect(transformedAudits[0]["snapshot"]).toEqual(
      "Attachment\n\nFile Name: cats.jpg\nDescription: Cute cats"
    );
  });

  test("snapshot formats audit details when object of arrays", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubject(AUDIT_SUBJECT.CASE_DETAILS)
      .withAuditDetails({
        Case: ["Case Reference, Status"],
        "Complainant Civilians": ["First Name", "Last Name"]
      });

    const transformedAudits = transformActionAuditsForExport([
      actionAuditAttributes
    ]);

    expect(transformedAudits[0].snapshot).toEqual(
      "Case Details\n\n" +
        "Case: Case Reference, Status\n" +
        "Complainant Civilians: First Name, Last Name"
    );
  });
});
