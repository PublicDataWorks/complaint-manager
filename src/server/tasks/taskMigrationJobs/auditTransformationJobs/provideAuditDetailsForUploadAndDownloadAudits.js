import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import models from "../../../models";

const Op = models.sequelize.Op;

export const sanitizeUploadDownloadAudits = async () => {
  await models.sequelize.transaction(async transaction => {
    const actionAudits = await models.action_audit.findAll({
      where: {
        [Op.or]: [
          { action: AUDIT_ACTION.DOWNLOADED },
          { action: AUDIT_ACTION.UPLOADED }
        ]
      }
    });

    for (
      let actionAuditIndex = 0;
      actionAuditIndex < actionAudits.length;
      actionAuditIndex++
    ) {
      await sanitizeSingleUploadDownloadAudit(
        actionAudits[actionAuditIndex],
        transaction
      );
    }
  });
};

export const sanitizeSingleUploadDownloadAudit = async (
  actionAudit,
  transaction
) => {
  const updatedActionAuditDetails = await getUpdatedAuditDetails(actionAudit);
  const updatedActionAuditSubject = getUpdatedSubject(actionAudit);

  await actionAudit.update(
    {
      auditDetails: updatedActionAuditDetails,
      subject: updatedActionAuditSubject
    },
    { transaction }
  );
};

const getUpdatedAuditDetails = async actionAudit => {
  switch (actionAudit.subject) {
    case AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF:
    case AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF:
    case "Referral Letter PDF":
      return await provideAuditDetailsForSingleUploadDownloadAudit(actionAudit);
    case AUDIT_SUBJECT.ATTACHMENT:
      return actionAudit.auditDetails;
    case "Attachments":
      return await formatAttachmentAuditDetails(actionAudit.auditDetails);
  }
};

const getUpdatedSubject = actionAudit => {
  if (actionAudit.subject === "Attachments") {
    return AUDIT_SUBJECT.ATTACHMENT;
  } else if (actionAudit.subject === "Referral Letter PDF") {
    return AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF;
  } else {
    return actionAudit.subject;
  }
};

export const provideAuditDetailsForSingleUploadDownloadAudit = async uploadDownloadActionAudit => {
  const fileName = await getAssociatedFileName(uploadDownloadActionAudit);

  return {
    fileName: [fileName]
  };
};

const getAssociatedFileName = async audit => {
  let letterModel;

  if (
    audit.subject === AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF ||
    audit.subject === "Referral Letter PDF"
  ) {
    letterModel = models.referral_letter;
  } else {
    letterModel = models.complainant_letter;
  }

  const letterAudit = await letterModel.findOne({
    where: { caseId: audit.caseId }
  });

  return letterAudit.finalPdfFilename;
};

const formatAttachmentAuditDetails = actionAuditDetails => {
  return {
    fileName: [actionAuditDetails.fileName]
  };
};

export const rollbackSanitizeUploadDownloadAudits = async () => {
  await models.sequelize.transaction(async transaction => {
    const actionAudits = await models.action_audit.findAll({
      where: {
        [Op.or]: [
          { action: AUDIT_ACTION.DOWNLOADED },
          { action: AUDIT_ACTION.UPLOADED }
        ]
      }
    });

    for (
      let actionAuditIndex = 0;
      actionAuditIndex < actionAudits.length;
      actionAuditIndex++
    ) {
      await rollbackSanitizeSingleUploadDownloadAudit(
        actionAudits[actionAuditIndex],
        transaction
      );
    }
  });
};

export const rollbackSanitizeSingleUploadDownloadAudit = async (
  actionAudit,
  transaction
) => {
  const rolledBackActionAuditDetails = getRollbackAuditDetails(actionAudit);
  const rolledBackActionAuditSubject = getRollbackSubject(actionAudit);

  await actionAudit.update(
    {
      auditDetails: rolledBackActionAuditDetails,
      subject: rolledBackActionAuditSubject
    },
    { transaction }
  );
};

const getRollbackAuditDetails = actionAudit => {
  if (actionAudit.subject === AUDIT_SUBJECT.ATTACHMENT) {
    return { fileName: actionAudit.auditDetails.fileName[0] };
  } else if (actionAudit.action === AUDIT_ACTION.UPLOADED) {
    return null;
  } else {
    return {};
  }
};

const getRollbackSubject = actionAudit => {
  if (actionAudit.subject === AUDIT_SUBJECT.ATTACHMENT) {
    return "Attachments";
  } else if (actionAudit.subject === AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF) {
    return "Referral Letter PDF";
  } else {
    return actionAudit.subject;
  }
};
