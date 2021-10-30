const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const config = require(__dirname + "/../config/config.js")[
  process.env.NODE_ENV
];
const fs = require("fs");

const getSecret = () => {
  if (process.env.NODE_ENV === "test") {
    return fs.readFileSync(config.authentication.publicKeyPath);
  } else {
    return jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 20,
      jwksUri: config.authentication.publicKeyURL
    });
  }
};

const jwtCheck = jwt({
  secret: getSecret(),
  audience: config.authentication.audience,
  issuer: config.authentication.issuer,
  algorithms: ["RS256"],
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

module.exports = jwtCheck;
