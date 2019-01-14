import ROUTES from "../../sharedUtilities/errorMessageConstants";

const newRelic = require("newrelic");
const Boom = require("boom");

const getMessage = request => {
  if (
    request.route &&
    request.route.path &&
    Object.keys(request.route.methods)[0]
  ) {
    return ROUTES[request.route.path][Object.keys(request.route.methods)[0]];
  }
  return "Something went wrong. Please try again.";
};

const errorHandler = (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);
  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
    response
      .status(boomError.output.statusCode)
      .json({ ...boomError.output.payload, message: getMessage(request) });
  } else {
    response.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

module.exports = errorHandler;
