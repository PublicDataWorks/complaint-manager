import {
  CASE_STATUS,
  DATA_UPDATED
} from "../../../../sharedUtilities/constants";
import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";

describe("transformAuditToCaseHistory", () => {
  test("it returns case history for given audits", () => {
    const dataChangeAudit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withModelName("Case Officer")
      .withModelDescription("Jasmine Rodda")
      .withModelId(5)
      .withCaseId(5)
      .withAction(DATA_UPDATED)
      .withChanges({
        firstName: { previous: "Emily", new: "Jasmine" }
      })
      .withUser("bob")
      .withCreatedAt(new Date("2018-06-12"));

    const caseHistories = transformAuditToCaseHistory([dataChangeAudit]);

    expect(caseHistories).toEqual([
      expect.objectContaining({
        user: dataChangeAudit.user,
        action: "Case Officer Updated",
        details: {
          "First Name": { previous: "Emily", new: "Jasmine" }
        },
        modelDescription: "Jasmine Rodda",
        timestamp: dataChangeAudit.createdAt,
        id: expect.anything()
      })
    ]);
  });

  test("it transforms multiple entries in the changes field", () => {
    const auditChanges = {
      complainantType: { previous: "Civilian", new: "Police Officer" },
      status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit], []);

    const expectedDetails = {
      "Complainant Type": { previous: "Civilian", new: "Police Officer" },
      Status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
    };
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });

  test("it transforms null values in changes field to empty string", () => {
    const auditChanges = {
      complainantType: { previous: null, new: "Police Officer" },
      status: { previous: CASE_STATUS.INITIAL, new: null }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit], []);

    const expectedDetails = {
      "Complainant Type": { previous: " ", new: "Police Officer" },
      Status: { previous: CASE_STATUS.INITIAL, new: " " }
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
    const caseHistories = transformAuditToCaseHistory([audit], []);

    const expectedDetails = {
      Incident: { previous: " ", new: "something" }
    };
    expect(caseHistories[0].details).toEqual(expectedDetails);
  });

  test("filters out addressable type", () => {
    const auditChanges = {
      id: { previous: null, new: 6 },
      city: { previous: null, new: "Chicago" },
      addressableType: { previous: null, new: "cases" }
    };
    const audit = new DataChangeAudit.Builder()
      .defaultDataChangeAudit()
      .withChanges(auditChanges);
    const caseHistories = transformAuditToCaseHistory([audit]);

    const expectedDetails = {
      City: { previous: " ", new: "Chicago" }
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
    const caseHistories = transformAuditToCaseHistory([audit], []);

    expect(caseHistories).toHaveLength(0);
  });
});
