import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import {
  dataChangeAuditBeforeCaseNoteAccess,
  provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes,
  setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes
} from "./provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes";

describe("test provide_audit_details_for_data_access_audits_when_accessing_case_notes", () => {
  let existingCase;
  const testuser = "Joan";

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes", () => {
    test("should not update case note audit details when time of audit is before end legacy time", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-02-24 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: {},
        createdAt: new Date("2019-02-24 17:03:51.27+00")
      });

      await provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {}
        })
      );
    });

    test("should update case note audit details when following create case note created before case note actions", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-04-02 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: {},
        createdAt: new Date("2019-04-02 17:03:51.27+00")
      });

      await provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {
            "Case Note": ["All Case Note Data"]
          }
        })
      );
    });

    test("should update case note audit details when following create case note", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-05-30 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: {},
        createdAt: new Date("2019-05-30 17:03:51.27+00")
      });

      await provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {
            "Case Note": ["All Case Note Data"],
            "Case Note Action": ["All Case Note Action Data"]
          }
        })
      );
    });

    test("should update case note audit details with only case note data when created after case note actions added", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_DELETED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-05-30 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: {},
        createdAt: new Date("2019-05-30 17:03:51.27+00")
      });

      await provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {
            "Case Note": ["All Case Note Data"]
          }
        })
      );
    });
  });

  describe("dataChangeAuditBeforeCaseNoteAccess", () => {
    test("should return true for create case note", () => {
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

      expect(dataChangeAuditBeforeCaseNoteAccess(audit)).toBeTruthy();
    });
    test("should return true for update case note", () => {
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

      expect(dataChangeAuditBeforeCaseNoteAccess(audit)).toBeTruthy();
    });
    test("should return true for remove case note", () => {
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

      expect(dataChangeAuditBeforeCaseNoteAccess(audit)).toBeTruthy();
    });
  });

  describe("setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes", () => {
    test("should set case note audit details to empty when following create case note", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-05-30 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: {
          "Case Note": ["All Case Note Data"],
          "Case Note Action": ["All Case Note Action Data"]
        },
        createdAt: new Date("2019-05-30 17:03:51.27+00")
      });

      await setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {}
        })
      );
    });
    test("should not set case note audit details to empty when time of audit is before end legacy time", async () => {
      await models.data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case Note",
        modelDescription: null,
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testuser,
        createdAt: new Date("2019-02-04 17:03:51.26+00")
      });

      const caseNoteAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        auditDetails: "auditDetails",
        createdAt: new Date("2019-02-04 17:03:51.27+00")
      });

      await setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes();

      await caseNoteAccessAudit.reload();

      expect(caseNoteAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: "auditDetails"
        })
      );
    });
  });
});
