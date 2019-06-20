import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import models from "../../../models";

export const updateCaseHistoryAuditDetails = async () => {
  const audits = await models.action_audit.findAll({
    where: { subject: AUDIT_SUBJECT.CASE_HISTORY }
  });

  for (let i = 0; i < audits.length; i++) {
    await updateSingleCaseHistoryAudit(audits[i]);
  }
};

const updateSingleCaseHistoryAudit = async audit => {
  const dataChangeAuditKey = "Data Change Audit";
  const actionAuditKey = "Action Audit";

  if (audit.auditDetails[dataChangeAuditKey]) {
    const newAuditDetails = {
      "Legacy Data Change Audit": audit.auditDetails[dataChangeAuditKey],
      [actionAuditKey]: audit.auditDetails[actionAuditKey]
    };

    await audit.update({ auditDetails: newAuditDetails });
  }
};

export const revertCaseHistoryAuditDetails = async () => {
  const audits = await models.action_audit.findAll({
    where: { subject: AUDIT_SUBJECT.CASE_HISTORY }
  });

  for (let i = 0; i < audits.length; i++) {
    await revertSingleCaseHistoryAudit(audits[i]);
  }
};

const revertSingleCaseHistoryAudit = async audit => {
  const legacyDataChangeAuditKey = "Legacy Data Change Audit";
  const actionAuditKey = "Action Audit";

  if (audit.auditDetails[legacyDataChangeAuditKey]) {
    const newAuditDetails = {
      "Data Change Audit": audit.auditDetails[legacyDataChangeAuditKey],
      [actionAuditKey]: audit.auditDetails[actionAuditKey]
    };

    await audit.update({ auditDetails: newAuditDetails });
  }
};
