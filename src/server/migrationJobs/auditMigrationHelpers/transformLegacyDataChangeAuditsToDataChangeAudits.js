import _ from "lodash";
import models from "../../models";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

export const transformLegacyDataChangeAuditsToDataChangeAudits = async transaction => {
  const legacyDataChangeAudits = await models.legacy_data_change_audit.findAll();

  for (let i = 0; i < legacyDataChangeAudits.length; i++) {
    await transformSingleLegacyDataChangeAuditToDataChangeAudit(
      legacyDataChangeAudits[i],
      transaction
    );
  }
};

const formatModelName = modelName => {
  if (modelName === "Case") {
    return "cases";
  } else {
    return _.camelCase(modelName);
  }
};

const legacyAuditDoesNotExistInDataChangeAudit = async audit => {
  const dataChangeAudit = await models.audit.findOne({
    where: {
      auditAction: audit.action,
      user: audit.user,
      caseId: audit.caseId,
      createdAt: audit.createdAt
    },
    include: [
      {
        model: models.data_change_audit,
        as: "dataChangeAudit"
      }
    ]
  });

  return !dataChangeAudit;
};

const transformSingleLegacyDataChangeAuditToDataChangeAudit = async (
  audit,
  transaction
) => {
  const shouldCreateAudit = await legacyAuditDoesNotExistInDataChangeAudit(
    audit
  );

  if (shouldCreateAudit) {
    await models.audit.create(
      {
        auditAction: audit.action,
        user: audit.user,
        caseId: audit.caseId,
        createdAt: audit.createdAt,
        dataChangeAudit: {
          modelName: formatModelName(audit.modelName),
          modelDescription: audit.modelDescription,
          modelId: audit.modelId,
          snapshot: audit.snapshot,
          changes: audit.changes
        }
      },
      {
        include: [
          {
            model: models.data_change_audit,
            as: "dataChangeAudit"
          }
        ],
        transaction
      }
    );
  }
};

export const revertDataChangeAuditsToLegacyDataChangeAudits = async transaction => {
  await models.data_change_audit.destroy({ truncate: true, cascade: true });
  await models.audit.destroy({
    where: {
      auditAction: {
        [models.sequelize.Op.or]: [
          AUDIT_ACTION.DATA_CREATED,
          AUDIT_ACTION.DATA_UPDATED,
          AUDIT_ACTION.DATA_ARCHIVED,
          AUDIT_ACTION.DATA_RESTORED,
          AUDIT_ACTION.DATA_DELETED
        ]
      }
    }
  });
};
