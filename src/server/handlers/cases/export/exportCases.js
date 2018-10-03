const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const kueJobQueue = require("./jobQueue");
const config = require("../../../config/config")[process.env.NODE_ENV];

const exportCases = asyncMiddleware(async (request, response, next) => {
  const job = kueJobQueue.create(JOB_OPERATION.CASE_EXPORT.key, {
    title: JOB_OPERATION.CASE_EXPORT.title,
    fileName: "case_export.csv",
    user: request.nickname
  });
  job.attempts(config.queue.failedJobAttempts);
  job.backoff({ delay: config.queue.exponentialDelay, type: "exponential" });
  job.ttl(config.queue.jobTimeToLive);

  job.save(() => {
    response.json({ jobId: job.id });
  });
});

module.exports = { exportCases, kueJobQueue };
