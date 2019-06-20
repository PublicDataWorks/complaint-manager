import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import {
  dataChangeAuditCalledGetCaseWithAllAssociations,
  getCaseWithAllAssociationsLegacyAuditDetails,
  provideAuditDetailsForDataAccessOfCaseWithAllAssociations,
  setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations
} from "./provideAuditDetailsForDataAccessOfCaseWithAllAssociations";

describe("test provide_audit_details_for_data_access_audits_when_auditing_case_with_all_associations migration", () => {
  let existingCase;
  const testuser = "Woolf";

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });
  describe("provideAuditDetailsForDataAccessOfCaseWithAllAssociations", () => {
    test("should update empty audit details that don't follow a change", async () => {
      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {}
      });

      const caseDetailsAccessAudit2 = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {}
      });

      await provideAuditDetailsForDataAccessOfCaseWithAllAssociations();

      await caseDetailsAccessAudit2.reload();

      expect(caseDetailsAccessAudit2).toEqual(
        expect.objectContaining({
          auditDetails: getCaseWithAllAssociationsLegacyAuditDetails
        })
      );
    });

    test("should not update audit details when audit is before created before end of audit legacy timestamp", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Officer Allegation",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_DELETED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-02-25 17:03:51.26+00")
      });

      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {},
        createdAt: new Date("2019-02-25 17:03:51.28+00")
      });

      await provideAuditDetailsForDataAccessOfCaseWithAllAssociations();

      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {}
        })
      );
    });

    test("should update audit details when following remove officer allegation", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Officer Allegation",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_DELETED,
        changes: {},
        user: testuser
      });

      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {}
      });

      await provideAuditDetailsForDataAccessOfCaseWithAllAssociations();

      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: getCaseWithAllAssociationsLegacyAuditDetails
        })
      );
    });
  });

  describe("setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations", () => {
    test("should not update audit details when audit is before created before end of audit legacy timestamp", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Officer Allegation",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_DELETED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-02-25 17:03:51.26+00")
      });

      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: "auditDetails",
        createdAt: new Date("2019-02-25 17:03:51.27+00")
      });

      await setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations();
      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: "auditDetails"
        })
      );
    });

    test("should set audit details to empty when following remove officer allegation", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Officer Allegation",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_DELETED,
        changes: {},
        user: testuser
      });

      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: getCaseWithAllAssociationsLegacyAuditDetails
      });

      await setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations();
      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {}
        })
      );
    });
  });

  describe("dataChangeAuditCalledGetCaseWithAllAssociations", () => {
    test("should return true for remove officer allegation", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Officer Allegation",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        username: testuser,
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create officer allegation", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Officer Allegation",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for edit officer allegation", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Officer Allegation",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for remove civilian", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Civilian",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create civilian", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Civilian",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for edit civilian", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Civilian",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for remove case officer", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Officer",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create case officer", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Officer",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for edit case officer", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Officer",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for case updated", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for upload attachment", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Attachment",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for delete attachment", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Attachment",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create case", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create case note", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Note",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for destroy case note", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Note",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for create address", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Address",
        action: AUDIT_ACTION.DATA_CREATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return true for update address", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Address",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeTruthy();
    });
    test("should return false for update case note", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case Note",
        action: AUDIT_ACTION.DATA_UPDATED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeFalsy();
    });
    test("should return false for archive case", async () => {
      const audit = {
        id: 1,
        case_id: existingCase.id,
        subject: "Case",
        action: AUDIT_ACTION.DATA_DELETED,
        audit_details: {},
        username: testuser,
        created_at: new Date("2019-05-29 17:03:51.26+00"),
        audit_type: AUDIT_TYPE.DATA_CHANGE
      };

      expect(
        dataChangeAuditCalledGetCaseWithAllAssociations(audit)
      ).toBeFalsy();
    });
  });
});
