import winston from "winston";
import Transport from "winston-transport";
import axios from "axios";

class MessageBatch {
  constructor(messageLimit = 1) {
    this.messages = [];
    this.messageLimit = messageLimit;
  }

  queue(message) {
    this.messages.push(message);
    if (this.messages.length < this.messageLimit) return null;
    return this.flush();
  }

  flush() {
    const oldMessages = [...this.messages];
    this.messages = [];
    return oldMessages;
  }
}

class BackendTransport extends Transport {
  constructor(transportOptions) {
    super(transportOptions);

    this.endpoint = transportOptions.endpoint || null;
    this.messageBatch = new MessageBatch();
  }

  async log(message, callback) {
    const payload = { messages: this.messageBatch.queue(message) };

    if (!payload.messages) {
      this.emit(message);
    } else {
      if (!this.endpoint) return console.warn("Endpoint is null. Aborting.");

      try {
        await axios.post(this.endpoint, payload);
        this.emit(message);
      } catch (error) {
        this.emit(error);
      }
    }

    if (callback) callback();
  }
}

const { combine, timestamp, label } = winston.format;
const winstonFormat = combine(
  label({ label: `${process.env.REACT_APP_ENV.toUpperCase()}` }),
  timestamp()
);

const winstonOptions = {
  format: winstonFormat,
  transports: [
    new BackendTransport({
      endpoint: "/api/logs"
    })
  ]
};

const logger = winston.createLogger(winstonOptions);

export default logger;
