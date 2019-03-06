import gracefulExit from "../sharedUtilities/gracefulExit";
import Boom from "boom";
import {
  SERVER_UNAVAILABLE_ERROR,
  TOO_MANY_REQUESTS_ERRORS
} from "../sharedUtilities/errorMessageConstants";

const MAXIMUM_ROUTE_COMPLETION_TIME = 10000;

export const handleSigterm = (app, server) => {
  if (app.locals.shuttingDown) return;
  app.locals.shuttingDown = true;
  gracefulExit(server);
};

export const refuseNewConnectionDuringShutdown = app => (
  request,
  response,
  next
) => {
  if (!app.locals.shuttingDown) return next();
  response.set("Connection", "close");
  response.status(503).send(SERVER_UNAVAILABLE_ERROR);
};

export const refuseDuplicateApiRequest = app => (request, response, next) => {
  cleanupExpiredApiRoutes(
    app.locals.currentlyRunningApiRoutes,
    new Date().getTime()
  );

  if (!requestIsAnApiCall(request.originalUrl)) {
    next();
  } else if (app.locals.currentlyRunningApiRoutes[getRequestKey(request)]) {
    next(Boom.tooManyRequests(TOO_MANY_REQUESTS_ERRORS.DUPLICATE_REQUEST));
  } else {
    app.locals.currentlyRunningApiRoutes[getRequestKey(request)] = {
      timestamp: new Date()
    };
    next();
  }
};

const getRequestKey = request => {
  return request.method.concat(request.originalUrl);
};

export const cleanupExpiredApiRoutes = (
  currentlyRunningApiRoutes,
  currentTime
) => {
  Object.keys(currentlyRunningApiRoutes).forEach(route => {
    if (
      currentTime - currentlyRunningApiRoutes[route].timestamp >=
      MAXIMUM_ROUTE_COMPLETION_TIME
    ) {
      delete currentlyRunningApiRoutes[route];
    }
  });
};

const requestIsAnApiCall = originalUrl => {
  return originalUrl.includes("/api");
};

export const removeFinishedSuccessfulRoute = app => (
  request,
  response,
  next
) => {
  delete app.locals.currentlyRunningApiRoutes[getRequestKey(request)];
};
