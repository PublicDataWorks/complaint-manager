import {
  handleSigterm,
  refuseNewConnectionDuringShutdown
} from "./workerHelpers";
import http from "http";
import getInstance from "../server/handlers/cases/export/queueFactory";

const newRelic = require("newrelic");

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const config = require("../server/config/config")[process.env.NODE_ENV];
const healthCheck = require("../server/handlers/healthCheck");
const errorHandler = require("../server/handlers/errorHandler");
const apiRouter = require("./apiRouter");
const expressWinston = require("express-winston");
const winston = require("winston");
const cookieParser = require("cookie-parser");
const { JOB_OPERATION } = require("../sharedUtilities/constants");

const csvCaseExport = require("./processors/exportCases/csvCaseExport");
const exportAuditLog = require("./processors/auditLogs/exportAuditLog");


winston.configure({
  transports: [
    new winston.transports.Console({
      json: config.winston.json,
      colorize: true
    })
  ],
  level: config.winston.logLevel,
  colorize: true // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

const app = express();
app.use(function(req, res, next) {
  res.header("X-powered-by", "<3");
  next();
});
const twoYearsInSeconds = 63113852;
app.locals.shuttingDown = false;
app.use(refuseNewConnectionDuringShutdown(app));

app.use(
  helmet.hsts({
    maxAge: twoYearsInSeconds
  })
);

app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.noSniff());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      formAction: ["'none'"],
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      connectSrc: config.contentSecurityPolicy.connectSrc,
      fontSrc: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      imgSrc: ["'self'"],
      scriptSrc: ["'self'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"]
    }
  })
);

const buildDirectory = path.join(__dirname, "../../build");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get("/health-check", healthCheck);

app.use(
  expressWinston.logger({
    winstonInstance: winston,
    requestWhitelist: ["url", "method", "body", "originalUrl", "query"], //hide request headers
    bodyBlacklist: ""
  })
);

app.use("/api", apiRouter);

app.get("*", function(req, res) {
  res.sendFile(path.join(buildDirectory, "index.html"));
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: winston,
    baseMeta: { trace: "See stack", memoryUsage: "" },
    requestWhitelist: ["url", "method", "originalUrl", "query"] //hide request headers and body
  })
);

app.use(errorHandler);

const queue = getInstance();

queue.process(JOB_OPERATION.CASE_EXPORT.key, 1, (job, done) => {
  csvCaseExport(job, done);
});

queue.process(JOB_OPERATION.AUDIT_LOG_EXPORT.key, 1, (job, done) => {
  exportAuditLog(job, done);
});

export const server = http.createServer(app);

process.on("SIGTERM", () => {
  handleSigterm(app);
});

export default app;
