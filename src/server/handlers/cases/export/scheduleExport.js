import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";
import { CASE_EXPORT_TYPE } from "../../../../sharedUtilities/constants";
import getInstance from "./queueFactory";

const {
  JOB_OPERATION,
  USER_PERMISSIONS
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const config = require("../../../config/config")[process.env.NODE_ENV];
const Boom = require("boom");

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
    dateRangeData.dateRange = getAndValidateDateRangeData(request);
  }

  const fflipFeatures = request.fflip ? request.fflip.features : null;

  const queue = getInstance();

  const job = await queue.add(
    JOB_OPERATION[request.params.operation].key,
    {
      title: JOB_OPERATION[request.params.operation].title,
      name: JOB_OPERATION[request.params.operation].name,
      user: request.nickname,
      features: fflipFeatures,
      ...dateRangeData
    },
    {
      attempts: config.queue.failedJobAttempts,
      timeout: config.queue.jobTimeToLive
    }
  );
  response.json({ jobId: job.id });
});

const throwErrorIfMissingDateRangeParameters = (query, operation) => {
  let errors = [];

  if (!query.exportStartDate) {
    errors.push(BAD_DATA_ERRORS.MISSING_DATE_RANGE_START_DATE);
  }
  if (!query.exportEndDate) {
    errors.push(BAD_DATA_ERRORS.MISSING_DATE_RANGE_END_DATE);
  }
  if (!query.type && operation === JOB_OPERATION.CASE_EXPORT.name) {
    errors.push(BAD_DATA_ERRORS.MISSING_DATE_RANGE_TYPE);
  }
  if (errors.length > 1) {
    throw Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_PARAMETERS);
  } else if (errors.length === 1) {
    throw Boom.badData(errors[0]);
  }
};

const noDateRangeParametersGiven = (query, operation) => {
  switch (operation) {
    case JOB_OPERATION.CASE_EXPORT.name:
      return !query.exportStartDate && !query.exportEndDate && !query.type;
    case JOB_OPERATION.AUDIT_LOG_EXPORT.name:
      return !query.exportStartDate && !query.exportEndDate;
  }
};

const throwErrorIfDateParametersOutOfOrder = query => {
  if (moment(query.exportStartDate).isAfter(moment(query.exportEndDate))) {
    throw Boom.badData(BAD_DATA_ERRORS.DATE_RANGE_IN_INCORRECT_ORDER);
  }
};

export const getAndValidateDateRangeData = request => {
  const query = request.query;
  const operation = request.params.operation;

  if (noDateRangeParametersGiven(query, operation)) return null;

  throwErrorIfMissingDateRangeParameters(query, operation);

  throwErrorIfDateParametersOutOfOrder(query);

  const dateRange = {
    exportStartDate: query.exportStartDate,
    exportEndDate: query.exportEndDate
  };

  if (
    operation === JOB_OPERATION.CASE_EXPORT.name &&
    Object.values(CASE_EXPORT_TYPE).includes(query.type)
  ) {
    dateRange.type = query.type;
  }

  return dateRange;
};

export default scheduleExport;
