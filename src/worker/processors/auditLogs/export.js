const {
  TIMEZONE,
  JOB_OPERATION
} = require("../../../sharedUtilities/constants");

const models = require("../../../server/models/index");
const stringify = require("csv-stringify");
const util = require("util");
const promisifiedStringify = util.promisify(stringify);
const moment = require("moment");
const _ = require("lodash");
const transformDataChangeAuditForExport = require("./transformDataChangeAuditForExport");
const transformActionAuditForExport = require("./transformActionAuditsForExport");
const uploadFileToS3 = require("../fileUpload/uploadFileToS3");
const winston = require("winston");

const exportAuditLog = async (job, done) => {
  winston.info(`About to run Audit Log Export Job with id ${job.id}`);
  try {
    const dateFormatter = {
      date: formatDateForCSV
    };

    const columns = {
      audit_type: "Audit Type",
      user: "User",
      case_id: "Case Database ID",
      action: "Action",
      subject: "Audit Subject",
      subject_id: "Subject Database ID",
      changes: "Changes",
      snapshot: "Subject Details",
      created_at: "Timestamp"
    };
    const csvOptions = { header: true, columns, cast: dateFormatter };

    await models.sequelize.transaction(async t => {
      const actionAudits = await models.action_audit.findAll({
        attributes: [
          "created_at",
          "case_id",
          "action",
          "user",
          ["audit_type", "auditType"],
          "subject",
          ["subject_details", "subjectDetails"]
        ],
        raw: true,
        transaction: t
      });

      const modifiedActionAudits = transformActionAuditForExport(actionAudits);

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

      const sortedAuditLogs = _.orderBy(
        modifiedActionAudits.concat(modifiedDataChangeAudits),
        "created_at",
        "desc"
      );

      const csvOutput = await promisifiedStringify(sortedAuditLogs, csvOptions);
      const s3Result = await uploadFileToS3(
        job.id,
        csvOutput,
        JOB_OPERATION.AUDIT_LOG_EXPORT.filename,
        JOB_OPERATION.AUDIT_LOG_EXPORT.key
      );
      winston.info(`Done running Audit Log Export Job with id ${job.id}`);
      done(null, s3Result);
    });
  } catch (err) {
    winston.error(
      `Error running Audit Log Export Job with id ${job.id}: `,
      err
    );
    winston.error(util.inspect(err));
    done(err);
  }
};

const formatDateForCSV = date => {
  if (!date) {
    return "";
  }
  return moment(date)
    .tz(TIMEZONE)
    .format("MM/DD/YYYY HH:mm:ss z");
};

module.exports = exportAuditLog;
