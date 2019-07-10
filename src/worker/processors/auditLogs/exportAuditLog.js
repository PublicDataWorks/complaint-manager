import sequelize from "sequelize";
import getDateRangeForQuery from "../getDateRangeForQuery";
import getTransformedAudits from "./transformAudits/getTransformedAudits";

const {
  TIMEZONE,
  JOB_OPERATION
} = require("../../../sharedUtilities/constants");

const models = require("../../../server/models/index");
const stringify = require("csv-stringify");
const util = require("util");
const promisifiedStringify = util.promisify(stringify);
const moment = require("moment-timezone");
const _ = require("lodash");
const transformLegacyDataChangeAuditForExport = require("./transformAudits/transformLegacyDataChangeAuditForExport");
const transformActionAuditForExport = require("./transformAudits/transformActionAuditsForExport");
const uploadFileToS3 = require("../fileUpload/uploadFileToS3");
const winston = require("winston");

const Op = sequelize.Op;

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
      snapshot: "Audit Details",
      created_at: "Timestamp"
    };

    const dateRangeCondition = getDateRangeCondition(job.data.dateRange);

    const csvOptions = { header: true, columns, cast: dateFormatter };

    const transformedAudits =
      job.data.features && job.data.features.newAuditFeature
        ? await getTransformedAudits(dateRangeCondition)
        : await getOldTransformedAudits(dateRangeCondition);

    winston.info(
      `Transformed ${
        transformedAudits.length
      } audits that will be sorted and exported.`
    );

    const sortedAuditLogs = _.orderBy(transformedAudits, "created_at", "desc");

    const csvOutput = await promisifiedStringify(sortedAuditLogs, csvOptions);
    const filename = generateFilename(
      JOB_OPERATION.AUDIT_LOG_EXPORT,
      job.data.dateRange
    );

    winston.info(`Generated filename: ${filename} and uploading to S3...`);

    const s3Result = await uploadFileToS3(
      job.id,
      csvOutput,
      filename,
      JOB_OPERATION.AUDIT_LOG_EXPORT.key
    );
    winston.info(`Done running Audit Log Export Job with id ${job.id}`);
    done(null, s3Result);
  } catch (err) {
    winston.error(
      `Error running Audit Log Export Job with id ${job.id}: `,
      err
    );
    winston.error(util.inspect(err));
    done(err);
  }
};

const getDateRangeCondition = dateRange => {
  if (dateRange) {
    const dateRangeForQuery = getDateRangeForQuery(dateRange);
    return {
      createdAt: {
        [Op.between]: [
          dateRangeForQuery.exportStartDateAndTime,
          dateRangeForQuery.exportEndDateAndTime
        ]
      }
    };
  } else {
    return null;
  }
};

const getOldTransformedAudits = async dateRangeCondition => {
  const actionAudits = await models.action_audit.findAll({
    where: dateRangeCondition,
    attributes: [
      "created_at",
      "case_id",
      "action",
      "user",
      ["audit_type", "auditType"],
      "subject",
      ["audit_details", "auditDetails"]
    ],
    raw: true
  });

  const modifiedActionAudits = transformActionAuditForExport(actionAudits);

  const dataChangeAudits = await models.legacy_data_change_audit.findAll({
    where: dateRangeCondition,
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
    raw: true
  });

  const modifiedDataChangeAudits = transformLegacyDataChangeAuditForExport(
    dataChangeAudits
  );

  return modifiedActionAudits.concat(modifiedDataChangeAudits);
};

const generateFilename = (jobOperation, dateRange) => {
  return `${jobOperation.filename}${formatDateRangeForFilename(dateRange)}`;
};

const formatDateRangeForFilename = dateRange => {
  if (dateRange) {
    return `_${moment(dateRange.exportStartDate).format(
      "YYYY-MM-DD"
    )}_to_${moment(dateRange.exportEndDate).format("YYYY-MM-DD")}`;
  } else {
    return "";
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
