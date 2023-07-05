import {
  BAD_REQUEST_ERRORS,
  NOT_FOUND_ERRORS
} from "../../sharedUtilities/errorMessageConstants";
import { API_ROUTES, PUBLIC_ROUTES } from "../apiRoutes";

const errorHandler = require("./errorHandler");
const httpMocks = require("node-mocks-http");
const Boom = require("boom");

describe("errorHandler", () => {
  test("should wrap non-Boom error", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();

    errorHandler(
      new Error("very sensitive error information"),
      request,
      response
    );

    expect(response.statusCode).toEqual(500);
    expect(response._getData()).toEqual(
      JSON.stringify({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Something went wrong. Please try again."
      })
    );
  });
  test("should mask 500 error response on public routes", () => {
    const path = "/public-data";
    const request = httpMocks.createRequest({
      route: {
        path: path
      }
    });
    const response = httpMocks.createResponse();

    errorHandler(
      Boom.badImplementation("very sensitive error information"),
      request,
      response
    );

    expect(response.statusCode).toEqual(500);
    expect(response._getData()).toEqual(
      JSON.stringify({
        statusCode: 500,
        error: "Internal Server Error",
        message: PUBLIC_ROUTES[path]["get"].errorMessage
      })
    );
  });

  test("should mask 500 error response", () => {
    const path = "/cases/:caseId";
    const request = httpMocks.createRequest({
      route: {
        path: path
      }
    });
    const response = httpMocks.createResponse();

    errorHandler(
      Boom.badImplementation("very sensitive error information"),
      request,
      response
    );

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
    errorHandler(
      Boom.notFound(NOT_FOUND_ERRORS.PAGE_NOT_FOUND),
      request,
      response
    );

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

      errorHandler(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS),
        request,
        response
      );

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
      errorHandler(Boom.badRequest(errorMessage), request, response);

      expect(response.statusCode).toEqual(400);
      expect(response._getData()).toEqual(
        JSON.stringify({
          statusCode: 400,
          error: "Bad Request",
          message: errorMessage
        })
      );
    });

    test("should return 401 status code for Unauthorized Requests ", () => {
      const errorMessage = "No authorization token was found";
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        }
      });
      const response = httpMocks.createResponse();

      errorHandler(Boom.unauthorized(errorMessage), request, response);
      expect(response.statusCode).toEqual(401);
      expect(response._getData()).toEqual(
        JSON.stringify({
          statusCode: 401,
          error: "Unauthorized",
          message: errorMessage
        })
      );
    });

    test("should return 401 status code if status === 401", () => {
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        }
      });
      const response = httpMocks.createResponse();

      errorHandler(
        { isBoom: true, status: 401, isServer: true },
        request,
        response
      );
      expect(response.statusCode).toEqual(401);
      expect(response._getData()).toEqual(
        JSON.stringify({
          message: "No authorization token was found"
        })
      );
    });
  });
});
