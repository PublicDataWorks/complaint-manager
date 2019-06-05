import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import models from "../../../models";

const Op = models.sequelize.Op;

export const sanitizeUploadDownloadAudits = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.action_audit.findAll({
      where: {
        [Op.or]: [
          { action: AUDIT_ACTION.DOWNLOADED },
          { action: AUDIT_ACTION.UPLOADED }
        ]
      }
    });

    for (let auditIndex = 0; auditIndex < audits.length; auditIndex++) {
      await sanitizeSingleUploadDownloadAudit(audits[auditIndex], transaction);
    }
  });
};

export const sanitizeSingleUploadDownloadAudit = async (audit, transaction) => {
  await audit.update(
    {
      auditDetails: await getUpdatedAuditDetails(audit),
      subject: getUpdatedSubject(audit)
    },
    { transaction }
  );
};

const getUpdatedAuditDetails = async audit => {
  switch (audit.subject) {
    case AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF:
    case AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF:
    case "Referral Letter PDF":
      return await provideAuditDetailsForSingleUploadDownloadAudit(audit);
    case AUDIT_SUBJECT.ATTACHMENT:
      return audit.auditDetails;
    case "Attachments":
      return await formatAttachmentAuditDetails(audit.auditDetails);
  }
};

const getUpdatedSubject = audit => {
  if (audit.subject === "Attachments") {
    return AUDIT_SUBJECT.ATTACHMENT;
  } else if (audit.subject === "Referral Letter PDF") {
    return AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF;
  } else {
    return audit.subject;
  }
};

export const provideAuditDetailsForSingleUploadDownloadAudit = async uploadDownloadAudit => {
  const fileName = await getAssociatedFileName(uploadDownloadAudit);

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

const formatAttachmentAuditDetails = auditDetails => {
  return {
    fileName: [auditDetails.fileName]
  };
};

export const rollbackSanitizeUploadDownloadAudits = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.action_audit.findAll({
      where: {
        [Op.or]: [
          { action: AUDIT_ACTION.DOWNLOADED },
          { action: AUDIT_ACTION.UPLOADED }
        ]
      }
    });

    for (let auditIndex = 0; auditIndex < audits.length; auditIndex++) {
      await rollbackSanitizeSingleUploadDownloadAudit(
        audits[auditIndex],
        transaction
      );
    }
  });
};

export const rollbackSanitizeSingleUploadDownloadAudit = async (
  audit,
  transaction
) => {
  let auditDetails, subject;

  auditDetails = getRollbackAuditDetails(audit);
  subject = getRollbackSubject(audit);

  await audit.update(
    {
      auditDetails: auditDetails,
      subject: subject
    },
    { transaction }
  );
};

const getRollbackAuditDetails = audit => {
  if (audit.subject === AUDIT_SUBJECT.ATTACHMENT) {
    return { fileName: audit.auditDetails.fileName[0] };
  } else if (audit.action === AUDIT_ACTION.UPLOADED) {
    return null;
  } else {
    return {};
  }
};

const getRollbackSubject = audit => {
  if (audit.subject === AUDIT_SUBJECT.ATTACHMENT) {
    return "Attachments";
  } else if (audit.subject === AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF) {
    return "Referral Letter PDF";
  } else {
    return audit.subject;
  }
};
