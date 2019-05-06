import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";
import transformAuditsForExport from "./transformAuditsForExport";

describe("transformAuditsForExport", () => {
  test("transform log in audit correctly", () => {
    const audit = {
      auditAction: AUDIT_ACTION.LOGGED_IN,
      user: "someone",
      createdAt: "Timestamp",
      caseId: null,
      updatedAt: new Date(),
      id: 1
    };

    expect(transformAuditsForExport([audit])).toEqual([
      {
        action: AUDIT_ACTION.LOGGED_IN,
        case_id: null,
        audit_type: AUDIT_TYPE.AUTHENTICATION,
        created_at: "Timestamp",
        user: "someone"
      }
    ]);
  });
});
