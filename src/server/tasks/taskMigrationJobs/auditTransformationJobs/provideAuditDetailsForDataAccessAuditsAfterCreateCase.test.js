import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import models from "../../../models";
import {
  provideAuditDetailsForDataAccessAuditsAfterCreateCase,
  setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase
} from "./provideAuditDetailsForDataAccessAuditsAfterCreateCase";

describe("test provide_audit_details_for_data_access_audits_after_create_case migration helpers", () => {
  let existingCase;
  const testuser = "Livia";

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });
  describe("provideAuditDetailsForDataAccessAuditsAfterCreateCase", () => {
    test("should not update audit details when audit is before created before end of audit legacy timestamp", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case",
        modelDescription: null,
        modelId: existingCase.id,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {
          complaintType: {
            new: "Civilian Initiated"
          }
        },
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

      await provideAuditDetailsForDataAccessAuditsAfterCreateCase();

      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {}
        })
      );
    });

    // test.skip("should update audit details when created with civilian", async () => {
    //   await models.legacy_data_change_audit.create({
    //     caseId: existingCase.id,
    //     modelName: "Case",
    //     modelDescription: null,
    //     modelId: existingCase.id,
    //     snapshot: {},
    //     action: AUDIT_ACTION.DATA_CREATED,
    //     changes: {
    //       complaintType: {
    //         new: "Civilian Initiated"
    //       }
    //     },
    //     user: testuser,
    //     createdAt: new Date("2019-05-29 17:03:51.26+00")
    //   });
    //
    //   const caseDetailsAccessAudit = await models.action_audit.create({
    //     action: AUDIT_ACTION.DATA_ACCESSED,
    //     auditType: AUDIT_TYPE.DATA_ACCESS,
    //     user: testuser,
    //     caseId: existingCase.id,
    //     subject: AUDIT_SUBJECT.CASE_DETAILS,
    //     auditDetails: {},
    //     createdAt: new Date("2019-05-29 17:03:51.269+00")
    //   });
    //
    //   await provideAuditDetailsForDataAccessAuditsAfterCreateCase();
    //
    //   await caseDetailsAccessAudit.reload();
    //
    //   expect(caseDetailsAccessAudit).toEqual(
    //     expect.objectContaining({
    //       auditDetails: {
    //         Case: ["All Case Data"],
    //         "Complainant Civilians": ["All Complainant Civilians Data"]
    //       }
    //     })
    //   );
    // });

    // test.skip("should update audit details when created without civilian", async () => {
    //   await models.legacy_data_change_audit.create({
    //     caseId: existingCase.id,
    //     modelName: "Case",
    //     modelDescription: null,
    //     modelId: existingCase.id,
    //     snapshot: {},
    //     action: AUDIT_ACTION.DATA_CREATED,
    //     changes: {
    //       complaintType: {
    //         new: "Rank Initiated"
    //       }
    //     },
    //     user: testuser,
    //     createdAt: new Date("2019-05-29 18:42:57.578+00")
    //   });
    //
    //   const caseDetailsAccessAudit = await models.action_audit.create({
    //     action: AUDIT_ACTION.DATA_ACCESSED,
    //     auditType: AUDIT_TYPE.DATA_ACCESS,
    //     user: testuser,
    //     caseId: existingCase.id,
    //     subject: AUDIT_SUBJECT.CASE_DETAILS,
    //     auditDetails: {},
    //     createdAt: new Date("2019-05-29 18:42:57.585+00")
    //   });
    //
    //   await provideAuditDetailsForDataAccessAuditsAfterCreateCase();
    //
    //   await caseDetailsAccessAudit.reload();
    //
    //   expect(caseDetailsAccessAudit).toEqual(
    //     expect.objectContaining({
    //       auditDetails: {
    //         Case: ["All Case Data"]
    //       }
    //     })
    //   );
    // });
  });

  describe("setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase", () => {
    test("should not change audit details for data access before end of legacy audits time", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Case",
        modelDescription: null,
        modelId: existingCase.id,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {
          complaintType: {
            new: "Rank Initiated"
          }
        },
        user: testuser,
        createdAt: new Date("2019-02-24 18:42:57.578+00")
      });
      const caseDetailsAccessAudit = await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testuser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails: {
          Case: ["All Case Data"]
        },
        createdAt: new Date("2019-02-24 18:42:57.585+00")
      });

      await setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase();

      await caseDetailsAccessAudit.reload();

      expect(caseDetailsAccessAudit).toEqual(
        expect.objectContaining({
          auditDetails: {
            Case: ["All Case Data"]
          }
        })
      );
    });
    // test.skip("should set audit details to empty for data access after creation", async () => {
    //   await models.legacy_data_change_audit.create({
    //     caseId: existingCase.id,
    //     modelName: "Case",
    //     modelDescription: null,
    //     modelId: existingCase.id,
    //     snapshot: {},
    //     action: AUDIT_ACTION.DATA_CREATED,
    //     changes: {
    //       complaintType: {
    //         new: "Rank Initiated"
    //       }
    //     },
    //     user: testuser,
    //     createdAt: new Date("2019-05-29 18:42:57.578+00")
    //   });
    //   const caseDetailsAccessAudit = await models.action_audit.create({
    //     action: AUDIT_ACTION.DATA_ACCESSED,
    //     auditType: AUDIT_TYPE.DATA_ACCESS,
    //     user: testuser,
    //     caseId: existingCase.id,
    //     subject: AUDIT_SUBJECT.CASE_DETAILS,
    //     auditDetails: {
    //       Case: ["All Case Data"]
    //     },
    //     createdAt: new Date("2019-05-29 18:42:57.585+00")
    //   });
    //
    //   await setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase();
    //
    //   await caseDetailsAccessAudit.reload();
    //
    //   expect(caseDetailsAccessAudit).toEqual(
    //     expect.objectContaining({
    //       auditDetails: {}
    //     })
    //   );
    // });
  });
});
