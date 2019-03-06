import {
  cleanupExpiredApiRoutes,
  handleSigterm,
  refuseDuplicateApiRequest,
  refuseNewConnectionDuringShutdown,
  removeFinishedSuccessfulRoute
} from "./serverHelpers";
import Boom from "boom";
import gracefulExit from "../sharedUtilities/gracefulExit";
import {
  SERVER_UNAVAILABLE_ERROR,
  TOO_MANY_REQUESTS_ERRORS
} from "../sharedUtilities/errorMessageConstants";

const httpMocks = require("node-mocks-http");

jest.mock("../sharedUtilities/gracefulExit");

describe("server helpers", () => {
  let app;
  const server = "Mock Server";
  const next = jest.fn();
  const request = httpMocks.createRequest({
    method: "GET",
    originalUrl: "/api/route"
  });

  beforeEach(() => {
    next.mockClear();
  });

  describe("handleSigterm", () => {
    test("gracefulExit should not be called when already shutting down", () => {
      app = {
        locals: {
          shuttingDown: true
        }
      };

      handleSigterm(app, server);
      expect(gracefulExit).not.toHaveBeenCalled();
    });
    test("gracefulExit should be called when not already shutting down", () => {
      app = {
        locals: {
          shuttingDown: false
        }
      };

      handleSigterm(app, server);
      expect(gracefulExit).toHaveBeenCalledWith(server);
    });
  });
  describe("refuseNewConnectionDuringShutdown", () => {
    test("should not respond to new requests when shutting down", () => {
      const response = httpMocks.createResponse();
      app = {
        locals: {
          shuttingDown: true
        }
      };
      refuseNewConnectionDuringShutdown(app)(null, response, next);
      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 503,
          finished: true
        })
      );
      // for some reason in webstorm, connection is set to lower case, this or logic is meant to
      // accommodate that
      expect(
        response._headers.Connection === "close" ||
          response._headers.connection === "close"
      );
      expect(response._getData()).toEqual(SERVER_UNAVAILABLE_ERROR);
    });

    test("should call next when not shutting down", () => {
      const response = httpMocks.createResponse();

      app = {
        locals: {
          shuttingDown: false
        }
      };
      refuseNewConnectionDuringShutdown(app)(null, response, next);
      expect(next).toHaveBeenCalled();
      expect(response).toEqual(
        expect.objectContaining({
          finished: false
        })
      );
    });
  });
  describe("refuseDuplicateApiRequest", () => {
    test("request not to api should call next and not get added to current routes", () => {
      app = {
        locals: {
          currentlyRunningApiRoutes: {}
        }
      };

      const request = httpMocks.createRequest({
        originalUrl: "/route"
      });

      refuseDuplicateApiRequest(app)(request, null, next);

      expect(next).toHaveBeenCalled();
      expect(app.locals.currentlyRunningApiRoutes["/route"]).toBeFalsy();
    });

    test("repeat api request should call next with BOOM duplicate request", () => {
      app = {
        locals: {
          currentlyRunningApiRoutes: {
            "GET/api/route": { timestamp: new Date().getTime() }
          }
        }
      };

      refuseDuplicateApiRequest(app)(request, null, next);
      expect(next).toHaveBeenCalledWith(
        Boom.tooManyRequests(TOO_MANY_REQUESTS_ERRORS.DUPLICATE_REQUEST)
      );
    });
    test("api request should be added to the currently running routes if not duplicate request", () => {
      app = {
        locals: {
          currentlyRunningApiRoutes: {}
        }
      };
      refuseDuplicateApiRequest(app)(request, null, next);
      expect(app).toEqual(
        expect.objectContaining({
          locals: {
            currentlyRunningApiRoutes: {
              "GET/api/route": { timestamp: expect.anything() }
            }
          }
        })
      );
      expect(next).toHaveBeenCalledWith();
    });
    test("should clean up api route entries older than 10 seconds", () => {
      const tenSecondsInMilliseconds = 10000;
      const now = new Date().getTime();
      const nowTenSecondsAgo = now - tenSecondsInMilliseconds;

      app = {
        locals: {
          currentlyRunningApiRoutes: {
            "GET/api/route": {
              timestamp: nowTenSecondsAgo
            },
            "GET/api/route2": {
              timestamp: now
            }
          }
        }
      };
      cleanupExpiredApiRoutes(app.locals.currentlyRunningApiRoutes, now);

      expect(app).toEqual({
        locals: {
          currentlyRunningApiRoutes: {
            "GET/api/route2": {
              timestamp: now
            }
          }
        }
      });
    });
  });
  describe("removeFinishedSuccessfulRoute", () => {
    test("should remove finished successful route", () => {
      app = {
        locals: {
          currentlyRunningApiRoutes: {
            "GET/api/route": { timestamp: "timestamp" }
          }
        }
      };
      removeFinishedSuccessfulRoute(app)(request, null, null);
      expect(app.locals.currentlyRunningApiRoutes["GET/api/route"]).toBeFalsy();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
