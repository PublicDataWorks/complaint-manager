import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EventEmitter from "events";
import winston from "winston/lib/winston";

const config = require("./server/config/config")[process.env.NODE_ENV];

EventEmitter.defaultMaxListeners = 67;
Enzyme.configure({ adapter: new Adapter() });
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

winston.configure({
  transports: [
    new winston.transports.Console({
      json: config.winston.json,
      colorize: true
    })
  ],
  level: config.winston.logLevel,
  colorize: true
});
