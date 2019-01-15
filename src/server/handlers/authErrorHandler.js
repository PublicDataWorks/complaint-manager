import { UNAUTHORIZED_ERRORS } from "../../sharedUtilities/errorMessageConstants";

const Boom = require("boom");

const authErrorHandler = (err, req, res, next) => {
  if (err.name === UNAUTHORIZED_ERRORS.UNAUTHORIZED_ERROR) {
    next(Boom.unauthorized(UNAUTHORIZED_ERRORS.INVALID_TOKEN));
  } else {
    next(err);
  }
};

module.exports = authErrorHandler;
