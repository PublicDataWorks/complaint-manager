import models from "../../models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";
import sequelize from "sequelize";

const Op = sequelize.Op;

export const transformOldAuthenticationAuditsToNew = async transaction => {
  const oldAuthenticationAudits = await models.action_audit.findAll({
    where: {
      auditType: AUDIT_TYPE.AUTHENTICATION
    }
  });

  for (let i = 0; i < oldAuthenticationAudits.length; i++) {
    await models.audit.create(
      {
        auditAction: oldAuthenticationAudits[i].action,
        user: oldAuthenticationAudits[i].user,
        createdAt: oldAuthenticationAudits[i].createdAt
      },
      { transaction }
    );
  }
};

export const transformNewAuthenticationAuditsToOld = async transaction => {
  const newAuthenticationAudits = await models.audit.findAll({
    where: {
      auditAction: {
        [Op.or]: [AUDIT_ACTION.LOGGED_IN, AUDIT_ACTION.LOGGED_OUT]
      }
    }
  });

  for (let i = 0; i < newAuthenticationAudits.length; i++) {
    const existingActionAudit = await models.action_audit.findOne({
      where: {
        action: newAuthenticationAudits[i].auditAction,
        createdAt: newAuthenticationAudits[i].createdAt,
        user: newAuthenticationAudits[i].user
      }
    });

    if (!existingActionAudit) {
      await models.action_audit.create(
        {
          action: newAuthenticationAudits[i].auditAction,
          createdAt: newAuthenticationAudits[i].createdAt,
          auditType: AUDIT_TYPE.AUTHENTICATION,
          user: newAuthenticationAudits[i].user
        },
        { transaction }
      );
    }
  }

  await models.audit.destroy({
    where: {
      auditAction: {
        [Op.or]: [AUDIT_ACTION.LOGGED_IN, AUDIT_ACTION.LOGGED_OUT]
      }
    }
  });
};
