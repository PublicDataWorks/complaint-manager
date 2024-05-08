import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import EventEmitter from "events";
import winston from "winston";
import "jest-extended";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

// TODO: Remove when tests are running stably with new workers.
console.log("Running on Worker: ", process.env.JEST_WORKER_ID);
console.warn = () => {}; // silence warnings for more readable test results

EventEmitter.defaultMaxListeners = 67;
Enzyme.configure({ adapter: new Adapter() });
jest.setTimeout(30000);

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

if (global.document) {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document
    }
  });

  global.URL.createObjectURL = jest.fn();
}
