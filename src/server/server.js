import fs from "fs";
import http from "http";
import https from "https";

import {
  handleSigterm,
  refuseNewConnectionDuringShutdown
} from "./serverHelpers";

const newRelic = require("newrelic");

const express = require("express");
const enforce = require("express-sslify");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];
const healthCheck = require("./handlers/healthCheck");
const errorHandler = require("./handlers/errorHandler");
const apiRouter = require("./apiRouter");
const adminRouter = require("./adminRouter");
const featureToggleRouter = require("./featureToggleRouter");

const expressWinston = require("express-winston");
const winston = require("winston");
const { combine, json } = winston.format;

const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");

const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
const isOnCI = process.env.CIRCLECI;

winston.configure({
  format: combine(json()),
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

try {
  const swaggerUI = require("swagger-ui-express");
  const spec = require("../swagger/swagger.json");
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

  app.get("/api-docs.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
} catch (error) {
  console.error(
    `There was an error setting up the endpoint /api-docs. Error: ${error}`
  );
}

if (!isLowerEnv) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const corsConfig = {
  origin: config.corsOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.options("*", cors(corsConfig));

app.use(function (req, res, next) {
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
      defaultSrc: ["'self'"],
      manifestSrc: ["https://noipm-ci.herokuapp.com"],
      baseUri: ["'none'"],
      connectSrc: config.contentSecurityPolicy.connectSrc,
      fontSrc: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://www.google-analytics.com",
        "https://maps.googleapis.com"
      ],
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com",
        "https://www.google-analytics.com",
        "https://www.googletagmanager.com",
        "'unsafe-eval'"
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdn.quilljs.com",
        "'unsafe-inline'"
      ],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "https://dev-68895481.okta.com/"]
    }
  })
);

const buildDirectory = path.join(__dirname, "../../build");

app.use(cookieParser());
app.use(bodyParser.json());

app.get("/health-check", healthCheck);

app.use(featureToggleRouter);

app.use(
  expressWinston.logger({
    winstonInstance: winston,
    requestWhitelist: [
      "url",
      "method",
      "body",
      "originalUrl",
      "query",
      "headers['user-agent']"
    ], //hide request headers that have auth token
    //all request whitelist options are: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query', 'body']
    bodyBlacklist: ""
  })
);

app.use("/admin", adminRouter);
app.use("/api", apiRouter);

app.use(compression());
app.use(express.static(buildDirectory));

app.get("*", function (req, res) {
  res.sendFile(path.join(buildDirectory, "index.html"));
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: winston,
    baseMeta: { trace: "See stack", memoryUsage: "" },
    requestWhitelist: ["url", "method", "originalUrl", "headers['user-agent']"]
    // hide request headers and body for brevity. keep in mind this line may be emailed to team in error alert,
    // so don't log sensitive data from request body or query
  })
);

app.use(errorHandler);

export let server;

if (isLowerEnv && !isOnCI) {
  const options = {
    key: fs.readFileSync(".cert/client.key"),
    cert: fs.readFileSync(".cert/client.crt")
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

process.on("SIGTERM", () => {
  handleSigterm(app);
});

export default app;
