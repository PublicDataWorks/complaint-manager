import models from "../../models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";

const Op = models.sequelize.Op;

export const transformOldUploadDownloadAccessAuditsToNewFileAudits = async transaction => {
  const oldUploadDownloadActionAudits = await models.action_audit.findAll({
    where: {
      [Op.or]: [
        { action: AUDIT_ACTION.DOWNLOADED },
        { action: AUDIT_ACTION.UPLOADED }
      ]
    }
  });

  for (let i = 0; i < oldUploadDownloadActionAudits.length; i++) {
    await models.audit.create(
      {
        auditAction: oldUploadDownloadActionAudits[i].action,
        user: oldUploadDownloadActionAudits[i].user,
        createdAt: oldUploadDownloadActionAudits[i].createdAt,
        fileAudit: {
          fileName: oldUploadDownloadActionAudits[i].auditDetails.fileName[0],
          fileType: oldUploadDownloadActionAudits[i].subject
        }
      },
      {
        include: [{ model: models.file_audit, as: "fileAudit" }],
        transaction
      }
    );
  }
};

export const transformNewFileAuditsToOldUploadDownloadActionAudits = async transaction => {
  const audits = await models.audit.findAll({
    where: {
      [Op.or]: [
        { auditAction: AUDIT_ACTION.DOWNLOADED },
        { auditAction: AUDIT_ACTION.UPLOADED }
      ]
    },
    include: [
      {
        model: models.file_audit,
        as: "fileAudit"
      }
    ]
  });
  for (let i = 0; i < audits.length; i++) {
    await createUploadDownloadActionAuditIfNotExists(audits[i]);
  }

  await models.file_audit.destroy({
    truncate: true
  });

  await models.audit.destroy({
    where: {
      [Op.or]: [
        { auditAction: AUDIT_ACTION.DOWNLOADED },
        { auditAction: AUDIT_ACTION.UPLOADED }
      ]
    }
  });
};

const createUploadDownloadActionAuditIfNotExists = async audit => {
  if (await correspondingUploadDownloadAccessAuditDoesNotExist(audit)) {
    await models.action_audit.create({
      action: audit.auditAction,
      auditType: getAuditType(audit),
      user: audit.user,
      caseId: audit.caseId,
      createdAt: audit.createdAt,
      subject: audit.fileAudit.fileType,
      auditDetails: {
        fileName: [audit.fileAudit.fileName]
      }
    });
  }
};

const correspondingUploadDownloadAccessAuditDoesNotExist = async audit => {
  const existingActionAudit = await models.action_audit.findOne({
    where: {
      action: audit.auditAction,
      user: audit.user,
      createdAt: audit.createdAt,
      subject: audit.fileAudit.fileType
    }
  });

  return !existingActionAudit;
};

const getAuditType = audit => {
  if (audit.auditAction === "Uploaded") {
    return AUDIT_TYPE.UPLOAD;
  } else {
    return AUDIT_TYPE.DATA_ACCESS;
  }
};
