import ActionAudit from "../../../client/testUtilities/ActionAudit";
import { AUDIT_SUBJECT, AUDIT_TYPE } from "../../../sharedUtilities/constants";

const transformActionAuditsForExport = require("./transformActionAuditsForExport");

describe("transformActionAuditsForExport", () => {
  test("snapshot is blank if subject details are null", () => {
    const authAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .build();

    const transformedAudits = transformActionAuditsForExport([authAction]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([expect.objectContaining({ snapshot: "" })])
    );
  });

  test("snapshot displays array contents if subject details is array", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubjectDetails(["model1", "model2"]);

    const transformedAudits = transformActionAuditsForExport([
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
      .withSubject(AUDIT_SUBJECT.ATTACHMENT)
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubjectDetails({
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

  test("snapshot formats subject details when object of arrays", () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.DATA_ACCESS)
      .withSubjectDetails({
        Case: ["Case Reference, Status"],
        "Complainant Civilians": ["First Name", "Last Name"]
      });

    const transformedAudits = transformActionAuditsForExport([
      actionAuditAttributes
    ]);
  });
});
