const Boom = require("boom");

const authErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    next(Boom.unauthorized("Invalid token"));
  } else {
    next(err);
  }
};

module.exports = authErrorHandler;
