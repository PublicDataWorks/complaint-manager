import { VALIDATION_ERROR_HEADER } from "../../sharedUtilities/constants";

const Boom = require("boom");

const asyncMiddleware = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (!err.isBoom) {
      return next(Boom.badImplementation(err));
    }
    if (err.message === VALIDATION_ERROR_HEADER) {
      err.output.payload.details = err.data;
    }

    next(err);
  }
};

module.exports = asyncMiddleware;
