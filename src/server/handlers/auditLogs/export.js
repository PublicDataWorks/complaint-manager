const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  EXPORTED
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const TIMEZONE = require("../../../sharedUtilities/constants").TIMEZONE;
const stringify = require("csv-stringify");
const moment = require("moment");
const _ = require("lodash");
const transformDataChangeAuditForExport = require("./transformDataChangeAuditForExport");

const formatDateForCSV = date => {
  if (!date) {
    return "";
  }
  return moment(date)
    .tz(TIMEZONE)
    .format("MM/DD/YYYY HH:mm:ss z");
};

const exportAuditLog = asyncMiddleware(async (request, response) => {
  const dateFormatter = {
    date: formatDateForCSV
  };

  const columns = {
    audit_type: "Audit Type",
    user: "User",
    case_id: "Case ID",
    action: "Action",
    subject: "Subject",
    subject_id: "Subject ID",
    changes: "Changes",
    snapshot: "Snapshot",
    created_at: "Timestamp"
  };
  const csvOptions = { header: true, columns, formatters: dateFormatter };

  const audit_logs = await models.sequelize.transaction(async t => {
    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG,
        caseId: null,
        user: request.nickname
      },
      {
        transaction: t
      }
    );

    const actionAudits = await models.action_audit.findAll({
      attributes: [
        "created_at",
        "case_id",
        "action",
        "user",
        "audit_type",
        "subject"
      ],
      raw: true,
      transaction: t
    });

    const dataChangeAudits = await models.data_change_audit.findAll({
      attributes: [
        "created_at",
        "case_id",
        "action",
        "user",
        "changes",
        "snapshot",
        "modelDescription",
        ["model_name", "subject"],
        ["model_id", "subject_id"]
      ],
      raw: true,
      transaction: t
    });

    const modifiedDataChangeAudits = transformDataChangeAuditForExport(
      dataChangeAudits
    );

    return _.orderBy(
      actionAudits.concat(modifiedDataChangeAudits),
      "created_at",
      "desc"
    );
  });

  stringify({ audit_logs }["audit_logs"], csvOptions, (err, csvOutput) => {
    response.send(csvOutput);
  });
});

module.exports = exportAuditLog;
