import {
  BAD_REQUEST_ERRORS,
  ROUTES
} from "../../sharedUtilities/errorMessageConstants";

const newRelic = require("newrelic");
const Boom = require("boom");

const requestSpecifiesRouteMethod = request => {
  return request.route && request.route.path && request.method;
};

const getErrorMessageForRouteAndMethod = request => {
  return ROUTES[request.route.path][request.method];
};

const get500ErrorMessage = request => {
  if (requestSpecifiesRouteMethod(request)) {
    return getErrorMessageForRouteAndMethod(request);
  }
  return "Something went wrong. Please try again.";
};

const errorHandler = (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);

  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
  }

  let { errorMessage, redirectUrl } = getRedirectUrlAndErrorMessage(
    boomError,
    request
  );

  response.status(boomError.output.statusCode).json({
    ...boomError.output.payload,
    message: errorMessage,
    redirectUrl: redirectUrl
  });
};

const getRedirectUrlAndErrorMessage = (boomError, request) => {
  if (boomError.isServer) {
    return { errorMessage: get500ErrorMessage(request) };
  }

  const boomErrorMessage = boomError.output.payload.message;

  switch (boomErrorMessage) {
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS:
      return {
        errorMessage: "Sorry, that page is not available",
        redirectUrl: `/cases/${request.caseId}`
      };
    case BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST:
      return {
        errorMessage: "Sorry, that page is not available",
        redirectUrl: `/`
      };
    case BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE:
      return {
        errorMessage: boomErrorMessage,
        redirectUrl: `/cases/${request.caseId}`
      };
    default:
      return { errorMessage: boomErrorMessage };
  }
};

module.exports = errorHandler;
