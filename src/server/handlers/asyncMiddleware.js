import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";

const Boom = require("boom");

const asyncMiddleware = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (!err.isBoom) {
      return next(Boom.badImplementation(err));
    }
    if (err.message === BAD_REQUEST_ERRORS.VALIDATION_ERROR_HEADER) {
      err.output.payload.details = err.data;
    }

    next(err);
  }
};

module.exports = asyncMiddleware;
