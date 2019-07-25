import models from "../../../models";
import sequelize from "sequelize";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import moment from "moment-timezone";

const Op = sequelize.Op;

// This should be called before transform upload download audit action is called

export const copyAttachmentDataChangeAuditsToActionAudits = async transaction => {
  const dataChangeAudits = await models.legacy_data_change_audit.findAll({
    where: {
      action: "Created",
      modelName: "Attachment"
    }
  });

  for (let i = 0; i < dataChangeAudits.length; i++) {
    try {
      await copyAttachmentIntoActionAuditTable(
        dataChangeAudits[i],
        transaction
      );
    } catch (error) {
      throw new Error(
        `Error while copying attachment into action audit table with legacy data change audit id ${
          dataChangeAudits[i].id
        }. \nInternal Error: ${error}`
      );
    }
  }
};

const copyAttachmentIntoActionAuditTable = async (
  attachmentAudit,
  transaction
) => {
  if (
    await attachmentAuditDoesNotAlreadyExistInActionAuditTable(
      attachmentAudit,
      transaction
    )
  ) {
    const fileName = [`${attachmentAudit.modelDescription[0]["File Name"]}`];
    const newCreatedAtTime = new Date(
      moment(attachmentAudit.createdAt).add(1, "ms")
    );
    await models.action_audit.create({
      action: AUDIT_ACTION.UPLOADED,
      auditType: AUDIT_TYPE.UPLOAD,
      user: attachmentAudit.user,
      caseId: attachmentAudit.caseId,
      subject: AUDIT_SUBJECT.ATTACHMENT,
      auditDetails: {
        fileName: fileName
      },
      createdAt: newCreatedAtTime
    });
  }
};

const attachmentAuditDoesNotAlreadyExistInActionAuditTable = async (
  attachmentAudit,
  transaction
) => {
  const fileName = [`${attachmentAudit.modelDescription[0]["File Name"]}`];

  const actionAudit = await models.action_audit.findOne({
    where: {
      action: AUDIT_ACTION.UPLOADED,
      caseId: attachmentAudit.caseId,
      subject: attachmentAudit.modelName,
      auditDetails: { [Op.eq]: { fileName: fileName } }
    },
    transaction
  });

  return !actionAudit;
};

export const deleteUploadAttachmentAudits = async transaction => {
  const uploadAttachmentAudits = await models.action_audit.findAll({
    where: {
      action: AUDIT_ACTION.UPLOADED,
      auditType: AUDIT_TYPE.UPLOAD,
      subject: AUDIT_SUBJECT.ATTACHMENT
    },
    transaction
  });

  for (let i = 0; i < uploadAttachmentAudits.length; i++) {
    await deleteUploadAttachment(uploadAttachmentAudits[i], transaction);
  }
};

const deleteUploadAttachment = async (attachmentAudit, transaction) => {
  await models.action_audit.destroy({
    where: {
      id: attachmentAudit.id
    },
    transaction
  });
};
