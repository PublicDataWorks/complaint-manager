const { QUEUE_PREFIX } = require("../../../../sharedUtilities/constants");

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

module.exports = kueJobQueue;
