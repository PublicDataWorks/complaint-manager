import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import models from "../models/index";
import winston from "winston";

const config = require("../config/config")[process.env.NODE_ENV];

export const suppressWinstonLogs = test => async () => {
  winston.remove(winston.transports.Console);
  try {
    await test();
  } catch (err) {
    throw err;
  } finally {
    winston.add(winston.transports.Console, {
      json: true,
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
  await models.address.destroy({
    truncate: true,
    cascade: true,
    force: true,
    auditUser: "test user"
  });
  await models.officer_allegation.destroy({
    truncate: true,
    cascade: true,
    force: true,
    auditUser: "test user"
  });
  await models.case_officer.destroy({
    truncate: true,
    cascade: true,
    auditUser: "test user"
  });
  await models.civilian.destroy({
    truncate: true,
    cascade: true,
    force: true,
    auditUser: "test user"
  });
  await models.attachment.destroy({
    truncate: true,
    cascade: true,
    force: true,
    auditUser: "test user"
  });
  await models.case_note.destroy({
    truncate: true,
    cascade: true,
    force: true,
    auditUser: "test user"
  });
  await models.action_audit.destroy({
    truncate: true,
    cascade: true,
    force: true
  });
  await models.cases.destroy({
    truncate: true,
    cascade: true,
    auditUser: "test user"
  });
  await models.allegation.destroy({
    truncate: true,
    cascade: true
  });
  await models.officer.destroy({ truncate: true, cascade: true });
  await models.data_change_audit.truncate();
};
