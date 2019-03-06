import API_ROUTES from "../apiRoutes";
import { removeFinishedSuccessfulRoute } from "../serverHelpers";
import { GENERIC_5xx_ERROR } from "../../sharedUtilities/errorMessageConstants";

const newRelic = require("newrelic");
const Boom = require("boom");

const tooManyRequestsStatusCode = 429;

const errorHandler = app => (error, request, response, next) => {
  let boomError = error.isBoom ? error : Boom.badImplementation(error);

  if (boomError.isServer) {
    newRelic.recordCustomEvent("ServerErrorEvent", boomError);
  }

  let errorMessage = getErrorMessage(boomError, request);

  response.status(boomError.output.statusCode).json({
    ...boomError.output.payload,
    message: errorMessage,
    caseId: request.caseId
  });

  removeFinishedSuccessfulRouteIfNotDuplicateRequest(request, boomError, app);
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
  return GENERIC_5xx_ERROR;
};

const getErrorMessage = (boomError, request) => {
  if (boomError.isServer) {
    return get500ErrorMessage(request);
  }

  return boomError.output.payload.message;
};

const removeFinishedSuccessfulRouteIfNotDuplicateRequest = (
  request,
  boomError,
  app
) => {
  if (boomError.output.statusCode !== tooManyRequestsStatusCode) {
    removeFinishedSuccessfulRoute(app)(request, null, null);
  }
};

module.exports = errorHandler;
