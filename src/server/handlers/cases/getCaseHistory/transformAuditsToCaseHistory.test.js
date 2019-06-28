import {
  CASE_STATUS,
  AUDIT_ACTION,
  CIVILIAN_INITIATED,
  RANK_INITIATED,
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  AUDIT_UPLOAD_DETAILS,
  AUDIT_FILE_TYPE
} from "../../../../sharedUtilities/constants";
import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit";
import transformAuditsToCaseHistory, {
  transformDataChangeAuditToCaseHistory,
  transformUploadAuditToCaseHistory
} from "./transformAuditsToCaseHistory";
import ActionAudit from "../../../../client/testUtilities/ActionAudit";
import models from "../../../models";

describe("transformAuditsToCaseHistory", () => {
  //TODO: remove when newAuditFeature toggle removed
  describe("newAuditFeature disabled", () => {
    const newAuditFeatureToggle = false;

    test("it returns case history for given audits", () => {
      const dataChangeAudit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withModelName("Case Officer")
        .withModelDescription("Jasmine Rodda")
        .withModelId(5)
        .withCaseId(5)
        .withAction(AUDIT_ACTION.DATA_UPDATED)
        .withChanges({
          firstName: { previous: "Emily", new: "Jasmine" }
        })
        .withUser("bob")
        .withCreatedAt(new Date("2018-06-12"));

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [dataChangeAudit]
        },
        newAuditFeatureToggle
      );

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
        complaintType: { previous: CIVILIAN_INITIATED, new: RANK_INITIATED },
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Complaint Type": { previous: CIVILIAN_INITIATED, new: RANK_INITIATED },
        Status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("it transforms null values or blank string in changes field to single space for readability", () => {
      const auditChanges = {
        complaintType: { previous: null, new: RANK_INITIATED },
        status: { previous: CASE_STATUS.INITIAL, new: null },
        other: { previous: "", new: "something" }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Complaint Type": { previous: " ", new: RANK_INITIATED },
        Status: { previous: CASE_STATUS.INITIAL, new: " " },
        Other: { previous: " ", new: "something" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("it transforms true and false values to true or false strings", () => {
      const auditChanges = {
        includeRetaliationConcerns: { new: true, previous: false }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Include Retaliation Concerns": { previous: "false", new: "true" }
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
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Incident: { previous: " ", new: "something" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out updates to lat, lng, and placeId", () => {
      const auditChanges = {
        lat: { previous: 90, new: 100 },
        lng: { previous: 40, new: 45 },
        placeId: { previous: "IEOIELKJSF", new: "OIERU2348" },
        latch: { previous: "door", new: "window" },
        slngs: { previous: "something", new: "something else" }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Latch: { previous: "door", new: "window" },
        Slngs: { previous: "something", new: "something else" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out addressable type", () => {
      const auditChanges = {
        id: { previous: null, new: 6 },
        city: { previous: null, new: "Chicago" },
        addressableType: { previous: null, new: ADDRESSABLE_TYPE.CASES }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        City: { previous: " ", new: "Chicago" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out update audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        someReferenceId: { previous: 4, new: 5 }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withAction(AUDIT_ACTION.DATA_UPDATED)
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(0);
    });

    test("does not filter out create audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        incidentLocationId: { previous: null, new: 5 }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withAction(AUDIT_ACTION.DATA_CREATED)
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual({});
    });

    test("does not filter out delete audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        incidentLocationId: { previous: 5, new: null }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withAction(AUDIT_ACTION.DATA_DELETED)
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual({});
    });

    test("strips html tags from results", () => {
      const auditChanges = {
        note: {
          previous: "<p>something <b>nested</b></p> <div>more</div>",
          new:
            "<b>bold stuff</b> <em>italic stuff</em> This uses the < symbol that shouldn't be deleted. >"
        }
      };
      const audit = new DataChangeAudit.Builder()
        .defaultDataChangeAudit()
        .withAction(AUDIT_ACTION.DATA_UPDATED)
        .withChanges(auditChanges);
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Note: {
          previous: "something nested more",
          new:
            "bold stuff italic stuff This uses the < symbol that shouldn't be deleted. >"
        }
      };
      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });
    describe("transformDataChangeAuditToCaseHistory", async () => {
      test("it returns case history for given dataChange audit", async () => {
        const auditId = 123;
        const dataChangeAudit = new DataChangeAudit.Builder()
          .defaultDataChangeAudit()
          .withModelName("Case Officer")
          .withModelDescription("Jasmine Rodda")
          .withModelId(5)
          .withCaseId(5)
          .withAction(AUDIT_ACTION.DATA_UPDATED)
          .withChanges({
            firstName: { previous: "Emily", new: "Jasmine" }
          })
          .withUser("bob")
          .withCreatedAt(new Date("2018-06-12"));

        const caseHistoryEntry = transformDataChangeAuditToCaseHistory(
          dataChangeAudit,
          auditId,
          newAuditFeatureToggle
        );

        expect(caseHistoryEntry).toEqual(
          expect.objectContaining({
            user: dataChangeAudit.user,
            action: "Case Officer Updated",
            details: {
              "First Name": { previous: "Emily", new: "Jasmine" }
            },
            modelDescription: "Jasmine Rodda",
            timestamp: dataChangeAudit.createdAt,
            id: auditId
          })
        );
      });
    });

    describe("transformUploadAuditToCaseHistory", async () => {
      test("it returns case history for given upload audit", async () => {
        const auditId = 123;
        const uploadAudit = new ActionAudit.Builder()
          .defaultActionAudit()
          .withAction(AUDIT_ACTION.UPLOADED)
          .withSubject(AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF)
          .withAuditType(AUDIT_TYPE.UPLOAD)
          .withUser("nickname")
          .withCreatedAt(new Date("2018-06-12"));

        const caseHistoryEntry = transformUploadAuditToCaseHistory(
          uploadAudit,
          auditId,
          newAuditFeatureToggle
        );

        expect(caseHistoryEntry).toEqual(
          expect.objectContaining({
            user: uploadAudit.user,
            action: `${AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF} ${
              AUDIT_ACTION.UPLOADED
            }`,
            details: AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF,
            modelDescription: "",
            timestamp: uploadAudit.createdAt,
            id: auditId
          })
        );
      });
    });
  });

  describe("newAuditFeature enabled", () => {
    const newAuditFeatureToggle = true;
    const testUser = "GRiZ";

    test("it returns case history for given audits", () => {
      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: { firstName: { previous: "Emily", new: "Jasmine" } }
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toEqual([
        expect.objectContaining({
          user: testUser,
          action: "Case Officer Updated",
          details: {
            "First Name": { previous: "Emily", new: "Jasmine" }
          },
          modelDescription: "Jasmine Rodda",
          timestamp: audit.createdAt,
          id: expect.anything()
        })
      ]);
    });

    test("it returns case history for given cases audit", () => {
      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.cases.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: { firstName: { previous: "Emily", new: "Jasmine" } }
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toEqual([
        expect.objectContaining({
          user: testUser,
          action: "Case Updated",
          details: {
            "First Name": { previous: "Emily", new: "Jasmine" }
          },
          modelDescription: "Jasmine Rodda",
          timestamp: audit.createdAt,
          id: expect.anything()
        })
      ]);
    });

    test("it transforms multiple entries in the changes field", () => {
      const auditChanges = {
        complaintType: { previous: CIVILIAN_INITIATED, new: RANK_INITIATED },
        status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Complaint Type": { previous: CIVILIAN_INITIATED, new: RANK_INITIATED },
        Status: { previous: CASE_STATUS.INITIAL, new: CASE_STATUS.ACTIVE }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("it transforms null values or blank string in changes field to single space for readability", () => {
      const auditChanges = {
        complaintType: { previous: null, new: RANK_INITIATED },
        status: { previous: CASE_STATUS.INITIAL, new: null },
        other: { previous: "", new: "something" }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Complaint Type": { previous: " ", new: RANK_INITIATED },
        Status: { previous: CASE_STATUS.INITIAL, new: " " },
        Other: { previous: " ", new: "something" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("it transforms true and false values to true or false strings", () => {
      const auditChanges = {
        includeRetaliationConcerns: { new: true, previous: false }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        "Include Retaliation Concerns": { previous: "false", new: "true" }
      };

      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out updates to *Id and ^id$ fields but not *id", () => {
      const auditChanges = {
        incident: { previous: null, new: "something" },
        id: { previous: null, new: 6 },
        incidentLocationId: { previous: null, new: 5 }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Incident: { previous: " ", new: "something" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out updates to lat, lng, and placeId", () => {
      const auditChanges = {
        lat: { previous: 90, new: 100 },
        lng: { previous: 40, new: 45 },
        placeId: { previous: "IEOIELKJSF", new: "OIERU2348" },
        latch: { previous: "door", new: "window" },
        slngs: { previous: "something", new: "something else" }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Latch: { previous: "door", new: "window" },
        Slngs: { previous: "something", new: "something else" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out addressable type", () => {
      const auditChanges = {
        id: { previous: null, new: 6 },
        city: { previous: null, new: "Chicago" },
        addressableType: { previous: null, new: ADDRESSABLE_TYPE.CASES }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };

      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit]
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        City: { previous: " ", new: "Chicago" }
      };
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });

    test("filters out update audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        someReferenceId: { previous: 4, new: 5 }
      };

      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(0);
    });

    test("does not filter out create audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        incidentLocationId: { previous: null, new: 5 }
      };
      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_CREATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual({});
    });

    test("does not filter out delete audits that are empty after filtering *Id fields", () => {
      const auditChanges = {
        incidentLocationId: { previous: 5, new: null }
      };
      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_DELETED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual({});
    });

    test("strips html tags from results", () => {
      const auditChanges = {
        note: {
          previous: "<p>something <b>nested</b></p> <div>more</div>",
          new:
            "<b>bold stuff</b> <em>italic stuff</em> This uses the < symbol that shouldn't be deleted. >"
        }
      };
      const audit = {
        id: 1,
        auditAction: AUDIT_ACTION.DATA_UPDATED,
        user: testUser,
        createdAt: new Date("2018-06-12"),
        updatedAt: "Another Timestamp",
        dataChangeAudit: {
          id: 2,
          modelName: models.case_officer.name,
          modelDescription: "Jasmine Rodda",
          modelId: 3,
          snapshot: { snap: "shot" },
          changes: auditChanges
        }
      };
      const caseHistories = transformAuditsToCaseHistory(
        {
          dataChangeAudits: [audit],
          uploadAudits: []
        },
        newAuditFeatureToggle
      );

      const expectedDetails = {
        Note: {
          previous: "something nested more",
          new:
            "bold stuff italic stuff This uses the < symbol that shouldn't be deleted. >"
        }
      };
      expect(caseHistories).toHaveLength(1);
      expect(caseHistories[0].details).toEqual(expectedDetails);
    });
    describe("transformDataChangeAuditToCaseHistory", async () => {
      test("it returns case history for given dataChange audit", async () => {
        const auditId = 123;

        const audit = {
          auditAction: AUDIT_ACTION.DATA_UPDATED,
          user: testUser,
          createdAt: new Date("2018-06-12"),
          updatedAt: "Another Timestamp",
          dataChangeAudit: {
            id: 2,
            modelName: models.case_officer.name,
            modelDescription: "Jasmine Rodda",
            modelId: 3,
            snapshot: { snap: "shot" },
            changes: { firstName: { previous: "Emily", new: "Jasmine" } }
          }
        };

        const caseHistoryEntry = transformDataChangeAuditToCaseHistory(
          audit,
          auditId,
          newAuditFeatureToggle
        );

        expect(caseHistoryEntry).toEqual(
          expect.objectContaining({
            user: testUser,
            action: "Case Officer Updated",
            details: {
              "First Name": { previous: "Emily", new: "Jasmine" }
            },
            modelDescription: "Jasmine Rodda",
            timestamp: audit.createdAt,
            id: auditId
          })
        );
      });
    });

    describe("transformUploadAuditToCaseHistory", async () => {
      test("it returns case history for given upload audit", async () => {
        const auditId = 123;
        const testFileName = "SusiesLastCommit.txt";

        const audit = {
          auditAction: AUDIT_ACTION.UPLOADED,
          user: testUser,
          createdAt: new Date("2018-06-12"),
          updatedAt: "Another Timestamp",
          fileAudit: {
            id: 2,
            fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
            fileName: testFileName
          }
        };

        const caseHistoryEntry = transformUploadAuditToCaseHistory(
          audit,
          auditId,
          newAuditFeatureToggle
        );

        expect(caseHistoryEntry).toEqual(
          expect.objectContaining({
            user: testUser,
            action: `${AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF} ${
              AUDIT_ACTION.UPLOADED
            }`,
            details: `Filename: ${testFileName}\nFinal Referral Letter PDF finalized and uploaded to S3`,
            modelDescription: "",
            timestamp: audit.createdAt,
            id: auditId
          })
        );
      });
    });
  });
});
