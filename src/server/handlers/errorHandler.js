import API_ROUTES from "../apiRoutes";

const newRelic = require("newrelic");
const Boom = require("boom");

const errorHandler = (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);

  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
  }

  let errorMessage = getErrorMessage(boomError, request);

  if (boomError.status === 401) {
    response.status(401).json({
      message: errorMessage
    });
  }

  response.status(boomError.output.statusCode).json({
    ...boomError.output.payload,
    message: errorMessage,
    caseId: request.caseId
  });
};

const requestSpecifiesRouteMethod = request => {
  return request.route && request.route.path && request.method;
};

const getErrorMessageForRouteAndMethod = request => {
  return API_ROUTES[request.route.path][request.method.toLowerCase()]
    .errorMessage;
};

const get500ErrorMessage = request => {
  if (requestSpecifiesRouteMethod(request)) {
    return getErrorMessageForRouteAndMethod(request);
  }
  return "Something went wrong. Please try again.";
};

const getErrorMessage = (boomError, request) => {
  if (boomError.isServer && boomError.status === 401){
    return "No authorization token was found";
  }

  if (boomError.isServer) {
    return get500ErrorMessage(request);
  }

  return boomError.output.payload.message;
};

module.exports = errorHandler;
