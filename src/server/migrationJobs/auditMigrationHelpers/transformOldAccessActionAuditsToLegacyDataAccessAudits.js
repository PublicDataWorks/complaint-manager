import models from "../../models";

import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import { endOfLegacyAuditTimestamps } from "../../tasks/taskMigrationJobs/auditTransformationJobs/auditTransformHelpers";

export const transformOldAccessActionAuditsToLegacyDataAccessAudits = async transaction => {
  const legacyAccessActionAudits = await models.action_audit.findAll({
    where: {
      action: AUDIT_ACTION.DATA_ACCESSED,
      createdAt: {
        [models.sequelize.Op.lt]:
          endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      }
    }
  });

  for (let i = 0; i < legacyAccessActionAudits.length; i++) {
    await transformSingleOldAccessActionAuditsToLegacyDataAccessAudits(
      legacyAccessActionAudits[i],
      transaction
    );
  }
};

const transformSingleOldAccessActionAuditsToLegacyDataAccessAudits = async (
  legacyAudit,
  transaction
) => {
  await models.audit.create(
    {
      auditAction: AUDIT_ACTION.DATA_ACCESSED,
      user: legacyAudit.user,
      caseId: legacyAudit.caseId,
      createdAt: legacyAudit.createdAt,
      legacyDataAccessAudit: {
        auditSubject: legacyAudit.subject,
        auditDetails: legacyAudit.auditDetails
      }
    },
    {
      include: [
        {
          model: models.legacy_data_access_audit,
          as: "legacyDataAccessAudit"
        }
      ],
      transaction
    }
  );
};

export const transformLegacyDataAccessAuditsToOldAccessActionAudits = async transaction => {
  await models.legacy_data_access_audit.destroy(
    {
      truncate: true,
      cascade: true
    },
    { transaction }
  );
  await models.audit.destroy(
    {
      where: {
        auditAction: AUDIT_ACTION.DATA_ACCESSED,
        createdAt: {
          [models.sequelize.Op.lt]:
            endOfLegacyAuditTimestamps[process.env.NODE_ENV]
        }
      }
    },
    { transaction }
  );
};
