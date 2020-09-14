import winston from "winston";
import Transport from "winston-transport";
import axios from 'axios';

class BackendTransport extends Transport {
  constructor(transportOptions) {
    super(transportOptions);

    this.endpoint = transportOptions.endpoint || null;
  }

  log(message, callback) {
    axios.post(this.endpoint, message)
      .then(response => {
        this.emit(message);
      })
      .catch(error => {
        this.emit(error);
      });
    
    if (callback) callback();
  }
}

const { combine, timestamp, label } = winston.format;
const winstonFormat = combine(
  label({ label: 'Client-side Log' }),
  timestamp()
);

const winstonOptions = {
  format: winstonFormat,
  transports: [
    new BackendTransport({
      endpoint: '/api/logs'
    })
  ]
};

const logger = winston.createLogger(winstonOptions);

export default logger;
