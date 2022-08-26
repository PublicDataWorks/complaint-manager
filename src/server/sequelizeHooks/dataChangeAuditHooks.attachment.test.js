import models from "../policeDataManager/models";
import Attachment from "../../sharedTestHelpers/attachment";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import Case from "../../sharedTestHelpers/case";
import CaseStatus from "../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("dataChangeAuditHooks for attachment", () => {
  let attachment, attachmentOriginalAttributes, existingCase;

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(null);

    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "me"
    });

    attachmentOriginalAttributes = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(existingCase.id);

    attachment = await models.attachment.create(attachmentOriginalAttributes, {
      auditUser: "someone"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("create attachment", () => {
    test("it saves basic attributes", async () => {
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      expect(audit.dataChangeAudit.modelId).toEqual(attachment.id);
      expect(audit.auditAction).toEqual(AUDIT_ACTION.DATA_CREATED);
      expect(audit.user).toEqual("someone");
      expect(audit.referenceId).toEqual(existingCase.id);
      expect(audit.dataChangeAudit.modelDescription).toEqual([
        { "File Name": attachment.fileName }
      ]);
      expect(audit.managerType).toEqual("complaint");
    });

    test("it saves snapshot of object values", async () => {
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      const expectedSnapshot = {
        ...attachmentOriginalAttributes,
        createdAt: attachment.createdAt.toJSON(),
        updatedAt: attachment.createdAt.toJSON(),
        id: attachment.id
      };

      expect(audit.dataChangeAudit.snapshot).toEqual(expectedSnapshot);
    });

    test("saves changes when creating new object", async () => {
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_CREATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      const expectedChanges = {
        caseId: { new: attachment.caseId },
        description: { new: attachment.description },
        fileName: { new: attachment.fileName }
      };

      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });
  });

  describe("update attachment", () => {
    let audits, audit;
    beforeEach(async () => {
      await attachment.update(
        {
          fileName: "newfilename.jpg",
          description: "new description"
        },
        { auditUser: "someone else" }
      );
      audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });
    });
    test("it creates a data change audit with basic attributes", async () => {
      expect(audit.dataChangeAudit.modelId).toEqual(attachment.id);
      expect(audit.user).toEqual("someone else");
      expect(audit.referenceId).toEqual(existingCase.id);
    });

    test("it stores the changes", async () => {
      const expectedChanges = {
        description: {
          previous: attachmentOriginalAttributes.description,
          new: "new description"
        },
        fileName: {
          previous: attachmentOriginalAttributes.fileName,
          new: "newfilename.jpg"
        }
      };
      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it stores the snapshot", async () => {
      await attachment.reload();
      const expectedSnapshot = {
        caseId: existingCase.id,
        fileName: "newfilename.jpg",
        description: "new description",
        createdAt: attachment.createdAt.toJSON(),
        updatedAt: attachment.updatedAt.toJSON(),
        id: attachment.id
      };
      expect(audit.dataChangeAudit.snapshot).toEqual(expectedSnapshot);
    });
  });

  describe("delete attachment", () => {
    test("it creates a data change object with basic attributes", async () => {
      await attachment.destroy({ auditUser: "someone else" });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      expect(audit.dataChangeAudit.modelId).toEqual(attachment.id);
      expect(audit.user).toEqual("someone else");
      expect(audit.referenceId).toEqual(existingCase.id);
    });

    test("it creates data change object when destroying from Model method", async () => {
      await models.attachment.destroy({
        where: { id: attachment.id },
        auditUser: "someone else"
      });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      expect(audit.dataChangeAudit.modelId).toEqual(attachment.id);
      expect(audit.user).toEqual("someone else");
      expect(audit.referenceId).toEqual(existingCase.id);
    });

    test("it stores the values being deleted in the changes field of the audit", async () => {
      await models.attachment.destroy({
        where: { id: attachment.id },
        auditUser: "someone else"
      });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      const expectedChanges = {
        fileName: {
          previous: attachment.fileName
        },
        description: {
          previous: attachment.description
        },
        caseId: {
          previous: attachment.caseId
        },
        id: {
          previous: attachment.id
        }
      };

      expect(audit.dataChangeAudit.changes).toEqual(expectedChanges);
    });

    test("it stores the snapshot at time of delete", async () => {
      await attachment.destroy({ auditUser: "someone else" });
      const audit = await models.audit.findOne({
        where: { auditAction: AUDIT_ACTION.DATA_DELETED },
        include: [
          {
            as: "dataChangeAudit",
            model: models.data_change_audit,
            where: {
              modelName: "attachment"
            }
          }
        ]
      });

      const expectedSnapshot = {
        caseId: attachment.caseId,
        description: attachment.description,
        id: attachment.id,
        fileName: attachment.fileName,
        updatedAt: attachment.updatedAt.toJSON(),
        createdAt: attachment.createdAt.toJSON()
      };
      expect(audit.dataChangeAudit.snapshot).toEqual(expectedSnapshot);
    });

    test("it does not delete the attachment if the audit fails to save", async () => {
      try {
        await attachment.destroy({ auditUser: null });
      } catch (e) {
        expect(e.message).toEqual(
          "User nickname must be given to db query for auditing. (Attachment Deleted)"
        );
      }
      models.audit
        .count({
          where: { auditAction: AUDIT_ACTION.DATA_DELETED },
          include: [{ as: "dataChangeAudit", model: models.data_change_audit }]
        })
        .then(numAudits => {
          expect(numAudits).toEqual(0);
        });
      const foundAttachment = await models.attachment.findByPk(attachment.id);
      expect(foundAttachment).not.toBeNull();
    });

    test("it does not delete the attachment if audit fails to save from class method", async () => {
      try {
        await models.attachment.destroy({
          where: { id: attachment.id },
          auditUser: null
        });
      } catch (e) {
        expect(e.message).toEqual(
          "User nickname must be given to db query for auditing. (Attachment Deleted)"
        );
      }
      models.audit
        .count({
          where: { auditAction: AUDIT_ACTION.DATA_DELETED },
          include: [{ as: "dataChangeAudit", model: models.data_change_audit }]
        })
        .then(numAudits => {
          expect(numAudits).toEqual(0);
        });
      const foundAttachment = await models.attachment.findByPk(attachment.id);
      expect(foundAttachment).not.toBeNull();
    });
  });
});
