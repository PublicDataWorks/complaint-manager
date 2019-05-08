import models from "../../models";
import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  JOB_OPERATION
} from "../../../sharedUtilities/constants";
import _ from "lodash";
import moment from "moment";
import { getAuditDetailsForExport } from "../../handlers/cases/export/generateExportDownloadUrl";

const getDateType = oldAuditDetails => {
  if (oldAuditDetails && oldAuditDetails["Date Type"]) {
    return _.camelCase(oldAuditDetails["Date Type"][0]);
  }
  return null;
};

const getDateRange = oldAuditDetails => {
  if (oldAuditDetails && oldAuditDetails["Export Range"]) {
    return oldAuditDetails["Export Range"][0]
      .split(" to ")
      .map(date => moment(new Date(date)).format("YYYY-MM-DD"));
  }
  return null;
};

export const transformOldExportAuditsToNew = async transaction => {
  const oldExportAudits = await models.action_audit.findAll({
    where: {
      auditType: AUDIT_TYPE.EXPORT
    }
  });

  const jobOperationDictionary = {};
  Object.keys(JOB_OPERATION).forEach(key => {
    jobOperationDictionary[JOB_OPERATION[key].auditSubject] =
      JOB_OPERATION[key].name;
  });

  for (let i = 0; i < oldExportAudits.length; i++) {
    const dateRange = getDateRange(oldExportAudits[i].auditDetails);
    const exportType = jobOperationDictionary[oldExportAudits[i].subject];
    const rangeType = getDateType(oldExportAudits[i].auditDetails);
    const created = await models.audit.create(
      {
        auditAction: oldExportAudits[i].action,
        user: oldExportAudits[i].user,
        createdAt: oldExportAudits[i].createdAt,
        exportAudit: {
          exportType: exportType,
          rangeType: rangeType,
          rangeStart: dateRange ? dateRange[0] : null,
          rangeEnd: dateRange ? dateRange[1] : null
        }
      },
      {
        include: [{ model: models.export_audit, as: "exportAudit" }],
        transaction
      }
    );
  }
};

const generateDateRangeFromNewAudit = audit => {
  const dateRange = {};

  if (audit.exportAudit.rangeType) {
    dateRange.type = audit.exportAudit.rangeType;
  }
  if (audit.exportAudit.rangeStart && audit.exportAudit.rangeEnd) {
    dateRange.exportStartDate = audit.exportAudit.rangeStart;
    dateRange.exportEndDate = audit.exportAudit.rangeEnd;
  }

  return dateRange;
};

export const transformNewExportAuditsToOld = async transaction => {
  const newExportAudits = await models.audit.findAll({
    where: {
      auditAction: AUDIT_ACTION.EXPORTED
    },
    include: [
      {
        model: models.export_audit,
        as: "exportAudit"
      }
    ]
  });

  for (let i = 0; i < newExportAudits.length; i++) {
    const existingActionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        user: newExportAudits[i].user,
        createdAt: newExportAudits[i].createdAt
      }
    });

    if (!existingActionAudit) {
      const dateRange = generateDateRangeFromNewAudit(newExportAudits[i]);

      await models.action_audit.create({
        action: AUDIT_ACTION.EXPORTED,
        auditType: AUDIT_TYPE.EXPORT,
        user: newExportAudits[i].user,
        caseId: null,
        subject:
          JOB_OPERATION[newExportAudits[i].exportAudit.exportType].auditSubject,
        auditDetails: _.isEmpty(dateRange)
          ? null
          : getAuditDetailsForExport(dateRange),
        createdAt: newExportAudits[i].createdAt
      });
    }

    await models.export_audit.destroy({
      truncate: true
    });

    await models.audit.destroy({
      where: {
        auditAction: AUDIT_ACTION.EXPORTED
      }
    });
  }
};
