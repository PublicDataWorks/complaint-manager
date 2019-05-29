import {
  ASCENDING,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import models from "../../models";
import _ from "lodash";
import moment from "moment-timezone";

module.exports = {
  up: async () => {
    await removeCaseDetailsAccessAuditsCreatedInApprovedLetter();
  },
  down: async () => {
    await restoreCaseDetailsAccessAuditsCreatedInApprovedLetter();
  }
};

const removeCaseDetailsAccessAuditsCreatedInApprovedLetter = async () => {
  await models.sequelize.transaction(async transaction => {
    const allAccessAudits = await models.action_audit.findAll({
      order: [["createdAt", ASCENDING]]
    });
    for (let i = 1; i < allAccessAudits.length - 1; i++) {
      if (shouldDeleteCurrentAudit(allAccessAudits, i)) {
        await allAccessAudits[i].destroy({ transaction });
      }
    }
  });
};

const restoreCaseDetailsAccessAuditsCreatedInApprovedLetter = async () => {
  await models.sequelize.transaction(async transaction => {
    const allAccessAudits = await models.action_audit.findAll({
      order: [["createdAt", ASCENDING]]
    });

    for (let i = 0; i < allAccessAudits.length - 1; i++) {
      if (
        auditIsLetterToComplainantUpload(allAccessAudits[i]) &&
        auditIsFinalReferralLetterUpload(allAccessAudits[i + 1])
      ) {
        await models.action_audit.create({
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: allAccessAudits[i].user,
          caseId: allAccessAudits[i].caseId,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails: {},
          createdAt: new Date(moment(allAccessAudits[i].createdAt).add(1, "ms"))
        });
      }
    }
  });
};

const shouldDeleteCurrentAudit = (accessAudits, currentAuditIndex) => {
  return (
    auditIsLetterToComplainantUpload(accessAudits[currentAuditIndex - 1]) &&
    auditIsCaseDetailsWithEmptyAuditDetails(accessAudits[currentAuditIndex]) &&
    auditIsFinalReferralLetterUpload(accessAudits[currentAuditIndex + 1])
  );
};

const auditIsLetterToComplainantUpload = audit => {
  return (
    audit.action === AUDIT_ACTION.UPLOADED &&
    audit.subject === AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF
  );
};

const auditIsCaseDetailsWithEmptyAuditDetails = audit => {
  return (
    audit.subject === AUDIT_SUBJECT.CASE_DETAILS &&
    _.isEmpty(audit.auditDetails)
  );
};

const auditIsFinalReferralLetterUpload = audit => {
  return (
    audit.action === AUDIT_ACTION.UPLOADED &&
    audit.subject === AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF
  );
};
