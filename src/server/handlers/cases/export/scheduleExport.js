import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const {
  JOB_OPERATION,
  USER_PERMISSIONS
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const kueJobQueue = require("./jobQueue");
const config = require("../../../config/config")[process.env.NODE_ENV];
const Boom = require("boom");

const scheduleExport = asyncMiddleware(async (request, response, next) => {
  const toggleIncludeHeardAboutFeature = checkFeatureToggleEnabled(
    request,
    "heardAboutFieldFeature"
  );

  if (
    JOB_OPERATION.AUDIT_LOG_EXPORT.key ===
    JOB_OPERATION[request.params.operation].key
  ) {
    const scopes = request.user.scope.split(" ");
    if (scopes.indexOf(USER_PERMISSIONS.EXPORT_AUDIT_LOG) === -1) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.OPERATION_NOT_PERMITTED);
    }
  }

  const job = kueJobQueue
    .createQueue()
    .create(JOB_OPERATION[request.params.operation].key, {
      title: JOB_OPERATION[request.params.operation].title,
      name: JOB_OPERATION[request.params.operation].name,
      user: request.nickname,
      toggleIncludeHeardAboutFeature: toggleIncludeHeardAboutFeature
    });
  job.attempts(config.queue.failedJobAttempts);
  job.backoff({ delay: config.queue.exponentialDelay, type: "exponential" });
  job.ttl(config.queue.jobTimeToLive);

  job.save(() => {
    response.json({ jobId: job.id });
  });
});

module.exports = scheduleExport;
