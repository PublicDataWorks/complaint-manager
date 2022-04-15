import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

const asyncMiddleware = fn => async (request, response, next) => {
  try {
    await fn(request, response, next);
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
