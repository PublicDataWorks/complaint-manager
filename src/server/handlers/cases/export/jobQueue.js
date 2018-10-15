const { QUEUE_PREFIX } = require("../../../../sharedUtilities/constants");

const config = require("../../../config/config")[process.env.NODE_ENV];
const kue = require("kue");
const redis = require("redis");
const winston = require("winston");

const redisConnection = {
  port: config.queue.port,
  host: config.queue.host,
  password: config.queue.password,
  no_ready_check: true,
  options: {
    no_ready_check: true
  }
};

const kueJobQueue = {
  createQueue: () => {
    return kue.createQueue({
      prefix: QUEUE_PREFIX,
      redis: {
        createClientFactory: () => {
          if (process.env.REDISCLOUD_URL) {
            winston.info("Connecting to Redis Cloud Url");
            return redis.createClient(process.env.REDISCLOUD_URL, {
              no_ready_check: true
            });
          }
          const client = redis.createClient(redisConnection);
          if (config.queue.password) {
            client.auth(config.queue.password);
          }
          return client;
        }
      }
    });
  }
};

module.exports = kueJobQueue;
