import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const config = require("./config/config")[process.env.NODE_ENV];

function buildTokenWithPermissions(permissions, nickname) {
  const privateKeyPath = path.join(__dirname, "config", "test", "private.pem");
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
}

module.exports = buildTokenWithPermissions;
