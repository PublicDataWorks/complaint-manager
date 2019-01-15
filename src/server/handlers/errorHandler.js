import { ROUTES } from "../../sharedUtilities/errorMessageConstants";

const newRelic = require("newrelic");
const Boom = require("boom");

const requestSpecifiesRouteMethod = request => {
  return (
    request.route && request.route.path && Object.keys(request.route.methods)[0]
  );
};

const getErrorMessageForRouteAndMethod = route => {
  return ROUTES[route.path][Object.keys(route.methods)[0]];
};

const getErrorMessage = request => {
  if (requestSpecifiesRouteMethod(request)) {
    return getErrorMessageForRouteAndMethod(request.route);
  }
  return "Something went wrong. Please try again.";
};

const errorHandler = (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);
  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
    response
      .status(boomError.output.statusCode)
      .json({ ...boomError.output.payload, message: getErrorMessage(request) });
  } else {
    response.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

module.exports = errorHandler;
