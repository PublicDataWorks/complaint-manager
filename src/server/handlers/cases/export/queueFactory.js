import { QUEUE_NAME } from "../../../../sharedUtilities/constants";

const { QUEUE_PREFIX } = require("../../../../sharedUtilities/constants");

const config = require("../../../config/config")[process.env.NODE_ENV];
const winston = require("winston");
import Queue from "bull";

let singletonQueue;

const getInstance = () => {
  function createQueue() {
    if (process.env.REDISCLOUD_URL) {
      winston.info("Connecting to Redis Cloud Url");
      singletonQueue = new Queue(QUEUE_NAME, process.env.REDISCLOUD_URL, {
        prefix: QUEUE_PREFIX
      });
    } else {
      const redisOpts = {
        port: config.queue.port,
        host: config.queue.host
      };
      singletonQueue = new Queue(QUEUE_NAME, {
        prefix: QUEUE_PREFIX,
        redis: redisOpts
      });
    }
  }

  if (!singletonQueue) {
    createQueue();
  }
  return singletonQueue;
};

export default getInstance;
