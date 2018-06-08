import { DATA_UPDATED } from "../../../../sharedUtilities/constants";
import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";

describe("transformAuditToCaseHistory", () => {
  test("it returns case history for given audits", () => {
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withModelName("civilian")
      .withModelDescription("Jasmine Rodda")
      .withModelId(5)
      .withCaseId(5)
      .withAction(DATA_UPDATED)
      .withChanges({
        firstName: { previous: "Emily", new: "Jasmine" }
      })
      .withUser("bob")
      .withCreatedAt(new Date());
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedCaseHistories = [
      {
        user: audit.user,
        action: "Civilian updated",
        details: {
          "First Name": { previous: "Emily", new: "Jasmine" }
        },
        modelDescription: "Jasmine Rodda",
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

    const expectedDetails = {
      "Complainant Type": { previous: "Civilian", new: "Police Officer" },
      Status: { previous: "Initial", new: "Active" }
    };
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });

  test("it transforms null values in changes field to empty string", () => {
    const auditChanges = {
      complainantType: { previous: null, new: "Police Officer" },
      status: { previous: "Initial", new: null }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedDetails = {
      "Complainant Type": { previous: " ", new: "Police Officer" },
      Status: { previous: "Initial", new: " " }
    };
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });

  test("filters out updates to *Id and ^id$ fields but not *id", () => {
    const auditChanges = {
      incident: { previous: null, new: "something" },
      id: { previous: null, new: 6 },
      incidentLocationId: { previous: null, new: 5 }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedDetails = {
      Incident: { previous: " ", new: "something" }
    };
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });

  test("filters out audits that are empty after filtering *Id fields", () => {
    const auditChanges = {
      incidentLocationId: { previous: null, new: 5 }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit]);

    expect(caseHistories).toHaveLength(0);
  });
});
