const { QUEUE_PREFIX } = require("../../../../sharedUtilities/constants");

const config = require("../../../config/config")[process.env.NODE_ENV];
const kue = require("kue");
const redis = require("redis");

const redisConnection = {
  port: config.queue.port,
  host: config.queue.host,
  password: config.queue.password,
  no_ready_check: true,
  options: {
    no_ready_check: true
  }
};

const kueJobQueue = kue.createQueue({
  prefix: QUEUE_PREFIX,
  redis: {
    createClientFactory: () => {
      const client = redis.createClient(redisConnection);
      if (config.queue.password) {
        client.auth(config.queue.password);
      }
      return client;
    }
  }
});

module.exports = kueJobQueue;
