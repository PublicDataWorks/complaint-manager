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
        action: EXPORTED,
        caseId: null,
        user: request.nickname
      },
      {
        transaction: t
      }
    );

    return await models.action_audit.findAll({
      order: [["created_at", "ASC"]],
      attributes: [
        "created_at",
        "case_id",
        "action",
        "user",
        [models.sequelize.literal(`'${AUDIT_SUBJECT.AUDIT_LOG}'`), "subject"],
        [models.sequelize.literal(`'${AUDIT_TYPE.EXPORT}'`), "audit_type"]
      ],
      raw: true,
      transaction: t
    });
  });

  stringify({ audit_logs }["audit_logs"], csvOptions, (err, csvOutput) => {
    response.send(csvOutput);
  });
});

module.exports = exportAuditLog;
