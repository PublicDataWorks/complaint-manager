import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import models from "../models/index";
import winston from "winston";

const config = require("../config/config")[process.env.NODE_ENV];

export const suppressWinstonLogs = test => async () => {
  winston.configure({
    transports: [
      new winston.transports.Console({
        json: config.winston.json,
        colorize: true,
        silent: true
      })
    ],
    level: config.winston.logLevel,
    colorize: true
  });

  try {
    await test();
  } catch (err) {
    throw err;
  } finally {
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
  }
};

export const buildTokenWithPermissions = (permissions, nickname) => {
  const privateKeyPath = path.join(
    __dirname,
    "../config",
    "test",
    "private.pem"
  );
  const cert = fs.readFileSync(privateKeyPath);

  const payload = {
    foo: "bar",
    scope: `${config.authentication.scope} ${permissions}`
  };
  payload[`${config.authentication.nicknameKey}`] = nickname;

  const options = {
    audience: config.authentication.audience,
    issuer: config.authentication.issuer,
    algorithm: config.authentication.algorithm
  };

  return jwt.sign(payload, cert, options);
};

export const cleanupDatabase = async () => {
  const truncationQuery =
    "TRUNCATE addresses CASCADE;" +
    "TRUNCATE cases_officers CASCADE;" +
    "TRUNCATE officers_allegations CASCADE;" +
    "TRUNCATE officers CASCADE;" +
    "TRUNCATE allegations CASCADE;" +
    "TRUNCATE civilians CASCADE;" +
    "TRUNCATE attachments CASCADE;" +
    "TRUNCATE case_notes CASCADE;" +
    "TRUNCATE action_audits CASCADE;" +
    "TRUNCATE data_change_audits CASCADE;" +
    "TRUNCATE cases CASCADE;";
  await models.sequelize.query(truncationQuery, {
    type: models.sequelize.QueryTypes.RAW
  });
};
