import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import {
  copyAttachmentDataChangeAuditsToActionAudits,
  deleteUploadAttachmentAudits
} from "./copyAttachmentDataChangeAuditsToActionAudits";
import moment from "moment-timezone";

describe("copy data change attachment audits", () => {
  let existingCase;
  const testUser = "Koala";
  const fileName = "koalaLife.rtf";

  beforeEach(async () => {
    existingCase = await createTestCaseWithCivilian();
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("copy data change attachment audits to action audits", () => {
    test("should transform a data change created attachment into an action audit uploaded attachment", async () => {
      const dataAudit = await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Attachment",
        modelDescription: [
          {
            "File Name": fileName
          }
        ],
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testUser
      });

      await models.sequelize.transaction(async transaction => {
        await copyAttachmentDataChangeAuditsToActionAudits(transaction);
      });

      const testCreatedAtTime = new Date(
        moment(dataAudit.createdAt).add(1, "ms")
      );

      const actionAudit = await models.action_audit.findOne({});

      expect(actionAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.UPLOADED,
          auditType: AUDIT_TYPE.UPLOAD,
          user: testUser,
          caseId: existingCase.id,
          subject: AUDIT_SUBJECT.ATTACHMENT,
          auditDetails: {
            fileName: [fileName]
          },
          createdAt: testCreatedAtTime
        })
      );
    });

    test("should not create action audit if attachment already exists for corresponding data change audit", async () => {
      await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Attachment",
        modelDescription: [
          {
            "File Name": fileName
          }
        ],
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testUser
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [fileName]
        }
      });

      await models.sequelize.transaction(async transaction => {
        await copyAttachmentDataChangeAuditsToActionAudits(transaction);
      });

      const actionAudit = await models.action_audit.findAll({});

      expect(actionAudit.length).toEqual(1);
      expect(actionAudit[0]).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.UPLOADED,
          auditType: AUDIT_TYPE.UPLOAD,
          user: testUser,
          caseId: existingCase.id,
          subject: AUDIT_SUBJECT.ATTACHMENT,
          auditDetails: {
            fileName: [fileName]
          }
        })
      );
    });

    test("should create action audit if download attachment exists but upload attachment does not", async () => {
      const dataAudit = await models.legacy_data_change_audit.create({
        caseId: existingCase.id,
        modelName: "Attachment",
        modelDescription: [
          {
            "File Name": fileName
          }
        ],
        modelId: 42,
        snapshot: {},
        action: AUDIT_ACTION.DATA_CREATED,
        changes: {},
        user: testUser
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [fileName]
        }
      });

      await models.sequelize.transaction(async transaction => {
        await copyAttachmentDataChangeAuditsToActionAudits(transaction);
      });

      const testCreatedAtTime = new Date(
        moment(dataAudit.createdAt).add(1, "ms")
      );

      const actionAudit = await models.action_audit.findOne({
        where: {
          action: AUDIT_ACTION.UPLOADED
        }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          action: AUDIT_ACTION.UPLOADED,
          auditType: AUDIT_TYPE.UPLOAD,
          user: testUser,
          caseId: existingCase.id,
          subject: AUDIT_SUBJECT.ATTACHMENT,
          auditDetails: {
            fileName: [fileName]
          },
          createdAt: testCreatedAtTime
        })
      );
    });
  });

  describe("Should upload attachment audits from action audit when migrating down", () => {
    test("Should delete upload attachment", async () => {
      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [fileName]
        }
      });

      await models.sequelize.transaction(async transaction => {
        await deleteUploadAttachmentAudits(transaction);
      });

      const actionAudits = await models.action_audit.findAll({});

      expect(actionAudits.length).toEqual(0);
    });

    test("Should not delete download attachment audit", async () => {
      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [fileName]
        }
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [fileName]
        }
      });

      await models.sequelize.transaction(async transaction => {
        await deleteUploadAttachmentAudits(transaction);
      });

      const actionAudits = await models.action_audit.findAll({});

      expect(actionAudits.length).toEqual(1);
    });
  });
});
