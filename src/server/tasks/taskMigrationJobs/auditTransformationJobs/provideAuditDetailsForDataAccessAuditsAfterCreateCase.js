import models from "../../../models";
import {
  endOfLegacyAuditTimestamps,
  getDataChangeAuditsAndActionAuditsQuery
} from "./auditTransformHelpers";
import {
  ASCENDING,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import _ from "lodash";

export const provideAuditDetailsForDataAccessAuditsAfterCreateCase = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.sequelize.query(
      getDataChangeAuditsAndActionAuditsQuery(
        endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      ),
      {
        type: models.sequelize.QueryTypes.SELECT,
        order: [["createdAt", ASCENDING]]
      }
    );

    for (let i = 1; i < audits.length - 1; i++) {
      if (
        auditIsCaseCreated(audits[i - 1]) &&
        auditIsCaseDetailsWithEmptyAuditDetails(audits[i])
      ) {
        const auditDetails = { Case: ["All Case Data"] };
        if (caseWasCreatedWithCivilian(audits[i - 1])) {
          auditDetails["Complainant Civilians"] = [
            "All Complainant Civilians Data"
          ];
        }
        await models.action_audit.update(
          { auditDetails: auditDetails },
          { where: { id: audits[i].id }, transaction }
        );
      }
    }
  });
};

export const setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.sequelize.query(
      getDataChangeAuditsAndActionAuditsQuery(
        endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      ),
      {
        type: models.sequelize.QueryTypes.SELECT,
        order: [["createdAt", ASCENDING]]
      }
    );

    for (let i = 1; i < audits.length - 1; i++) {
      if (
        auditIsCaseCreated(audits[i - 1]) &&
        auditIsCaseDetailsAccess(audits[i])
      ) {
        await models.action_audit.update(
          { auditDetails: {} },
          { where: { id: audits[i].id }, transaction }
        );
      }
    }
  });
};

const auditIsCaseCreated = audit => {
  return audit.action === AUDIT_ACTION.DATA_CREATED && audit.subject === "Case";
};

const auditIsCaseDetailsWithEmptyAuditDetails = audit => {
  return (
    audit.action === AUDIT_ACTION.DATA_ACCESSED &&
    audit.subject === AUDIT_SUBJECT.CASE_DETAILS &&
    _.isEmpty(audit.audit_details)
  );
};

const auditIsCaseDetailsAccess = audit => {
  return (
    audit.action === AUDIT_ACTION.DATA_ACCESSED &&
    audit.subject === AUDIT_SUBJECT.CASE_DETAILS
  );
};

const caseWasCreatedWithCivilian = audit => {
  return audit.audit_details.complaintType.new === "Civilian Initiated";
};
