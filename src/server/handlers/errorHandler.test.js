import {
  BAD_REQUEST_ERRORS,
  GENERIC_5xx_ERROR,
  NOT_FOUND_ERRORS,
  TOO_MANY_REQUESTS_ERRORS
} from "../../sharedUtilities/errorMessageConstants";
import { API_ROUTES } from "../apiRoutes";
import errorHandler from "./errorHandler";
import Boom from "boom";

const httpMocks = require("node-mocks-http");

const mockRemoveRouteHandler = jest.fn();
jest.mock("../serverHelpers", () => ({
  removeFinishedSuccessfulRoute: () => {
    return mockRemoveRouteHandler;
  }
}));

describe("errorHandler", () => {
  const app = {
    locals: {
      currentlyRunningApiRoutes: []
    }
  };

  beforeEach(() => {
    mockRemoveRouteHandler.mockClear();
  });

  test("should wrap non-Boom error", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();

    errorHandler(app)(
      new Error("very sensitive error information"),
      request,
      response
    );

    expect(mockRemoveRouteHandler).toHaveBeenCalled();
    expect(response.statusCode).toEqual(500);
    expect(response._getData()).toEqual(
      JSON.stringify({
        statusCode: 500,
        error: "Internal Server Error",
        message: GENERIC_5xx_ERROR
      })
    );
  });
  test("should mask 500 error response", () => {
    const path = "/cases/:caseId";
    const request = httpMocks.createRequest({
      route: {
        path: "/cases/:caseId"
      }
    });
    const response = httpMocks.createResponse();

    errorHandler(app)(
      Boom.badImplementation("very sensitive error information"),
      request,
      response
    );

    expect(mockRemoveRouteHandler).toHaveBeenCalled();
    expect(response.statusCode).toEqual(500);
    expect(response._getData()).toEqual(
      JSON.stringify({
        statusCode: 500,
        error: "Internal Server Error",
        message: API_ROUTES[path]["get"].errorMessage
      })
    );
  });

  test("should respond with boomified error message with its status code", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    errorHandler(app)(
      Boom.notFound(NOT_FOUND_ERRORS.PAGE_NOT_FOUND),
      request,
      response
    );

    expect(mockRemoveRouteHandler).toHaveBeenCalled();
    expect(response.statusCode).toEqual(404);
    expect(response._getData()).toEqual(
      JSON.stringify({
        statusCode: 404,
        error: "Not Found",
        message: "Page was not found"
      })
    );
  });
  describe("400 errors", () => {
    test("should return request with caseId and invalid case status when received case in wrong status error", () => {
      const caseId = 2;
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: caseId },
        caseId: caseId
      });
      const response = httpMocks.createResponse();

      errorHandler(app)(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS),
        request,
        response
      );

      expect(mockRemoveRouteHandler).toHaveBeenCalled();
      expect(response.statusCode).toEqual(400);
      expect(response._getData()).toEqual(
        JSON.stringify({
          statusCode: 400,
          error: "Bad Request",
          message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS,
          caseId: caseId
        })
      );
    });

    test("should return request with error message when received some other error", () => {
      const errorMessage = "error message";
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        }
      });
      const response = httpMocks.createResponse();
      errorHandler(app)(Boom.badRequest(errorMessage), request, response);

      expect(mockRemoveRouteHandler).toHaveBeenCalled();
      expect(response.statusCode).toEqual(400);
      expect(response._getData()).toEqual(
        JSON.stringify({
          statusCode: 400,
          error: "Bad Request",
          message: errorMessage
        })
      );
    });

    test("should return request with error message when duplicate route received", () => {
      const errorMessage = TOO_MANY_REQUESTS_ERRORS.DUPLICATE_REQUEST;
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        }
      });
      const response = httpMocks.createResponse();
      errorHandler(app)(Boom.tooManyRequests(errorMessage), request, response);

      expect(mockRemoveRouteHandler).not.toHaveBeenCalled();
      expect(response.statusCode).toEqual(429);
      expect(response._getData()).toEqual(
        JSON.stringify({
          statusCode: 429,
          error: "Too Many Requests",
          message: errorMessage
        })
      );
    });
  });
});
