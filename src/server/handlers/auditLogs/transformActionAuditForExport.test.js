import ActionAudit from "../../../client/testUtilities/ActionAudit";
import { AUDIT_TYPE } from "../../../sharedUtilities/constants";
const transformActionAuditForExport = require("./transformActionAuditForExport");

describe("transformActionAuditForExport", () => {
  test("should not have a snapshot if action is not a data access", () => {
    const authAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .build();

    const exportAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.EXPORT)
      .build();

    const transformedAudits = transformActionAuditForExport([
      authAction,
      exportAction
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ snapshot: "" }),
        expect.objectContaining({ snapshot: "" })
      ])
    );
  });
});
