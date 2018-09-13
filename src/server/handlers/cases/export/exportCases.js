const {
  JOB_OPERATION,
  QUEUE_PREFIX
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");

const config = require("../../../config/config")[process.env.NODE_ENV];
const kue = require("kue");

const createQueue = redisConnection => {
  return kue.createQueue({
    prefix: QUEUE_PREFIX,
    redis: redisConnection
  });
};

const kueJobQueue = createQueue(
  `redis://${config.queue.host}:${config.queue.port}`
);

const exportCases = asyncMiddleware(async (request, response, next) => {
  const job = kueJobQueue.create(JOB_OPERATION.CASE_EXPORT.key, {
    title: JOB_OPERATION.CASE_EXPORT.title,
    fileName: "case_export.csv",
    user: request.nickname
  });
  job.attempts(config.queue.failedJobAttempts);
  job.backoff({ delay: config.queue.exponentialDelay, type: "exponential" });
  job.ttl(config.queue.jobTimeToLive);
  job.save();

  response.send(job.id);
});

module.exports = { exportCases, kueJobQueue };
