import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";

const {
  JOB_OPERATION,
  USER_PERMISSIONS
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const kueJobQueue = require("./jobQueue");
const config = require("../../../config/config")[process.env.NODE_ENV];
const Boom = require("boom");

const getAndValidateDateRangeData = (exportStartDate, exportEndDate) => {
  if (!exportStartDate && !exportEndDate) {
    return null;
  } else if (!exportStartDate) {
    throw Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_START_DATE);
  } else if (!exportEndDate) {
    throw Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_END_DATE);
  } else if (moment(exportStartDate).isAfter(moment(exportEndDate))) {
    throw Boom.badData(BAD_DATA_ERRORS.DATE_RANGE_IN_INCORRECT_ORDER);
  } else {
    return {
      exportStartDate,
      exportEndDate
    };
  }
};

const scheduleExport = asyncMiddleware(async (request, response, next) => {
  if (
    JOB_OPERATION.AUDIT_LOG_EXPORT.key ===
    JOB_OPERATION[request.params.operation].key
  ) {
    const scopes = request.user.scope.split(" ");
    if (scopes.indexOf(USER_PERMISSIONS.EXPORT_AUDIT_LOG) === -1) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.OPERATION_NOT_PERMITTED);
    }
  }

  const dateRangeData = {};
  if (request.query) {
    dateRangeData.dateRange = getAndValidateDateRangeData(
      request.query.exportStartDate,
      request.query.exportEndDate
    );
  }

  const job = kueJobQueue
    .createQueue()
    .create(JOB_OPERATION[request.params.operation].key, {
      title: JOB_OPERATION[request.params.operation].title,
      name: JOB_OPERATION[request.params.operation].name,
      user: request.nickname,
      ...dateRangeData
    });
  job.attempts(config.queue.failedJobAttempts);
  job.backoff({ delay: config.queue.exponentialDelay, type: "exponential" });
  job.ttl(config.queue.jobTimeToLive);

  job.save(() => {
    response.json({ jobId: job.id });
  });
});

module.exports = scheduleExport;
