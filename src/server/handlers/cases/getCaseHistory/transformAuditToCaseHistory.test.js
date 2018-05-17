import { DATA_UPDATED } from "../../../../sharedUtilities/constants";
import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";

describe("transformAuditToCaseHistory", () => {
  test("it returns case history for given audits", () => {
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withModelName("case")
      .withModelId(5)
      .withCaseId(5)
      .withAction(DATA_UPDATED)
      .withChanges({
        complainantType: { previous: "Civilian", new: "Police Officer" }
      })
      .withUser("bob")
      .withCreatedAt(new Date());
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedCaseHistories = [
      {
        user: audit.user,
        action: "Case updated",
        details: [
          "Complainant Type changed from 'Civilian' to 'Police Officer'"
        ],
        timestamp: audit.createdAt,
        id: audit.id
      }
    ];
    expect(caseHistories).toEqual(expectedCaseHistories);
  });

  test("it transforms multiple entries in the changes field", () => {
    const auditChanges = {
      complainantType: { previous: "Civilian", new: "Police Officer" },
      status: { previous: "Initial", new: "Active" }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedDetails = [
      "Complainant Type changed from 'Civilian' to 'Police Officer'",
      "Status changed from 'Initial' to 'Active'"
    ];
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });
});
