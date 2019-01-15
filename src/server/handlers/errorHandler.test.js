import {
  NOT_FOUND_ERRORS,
  ROUTES
} from "../../sharedUtilities/errorMessageConstants";

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
  test("should mask 500 error response", () => {
    const path = "/cases/:caseId";
    const request = httpMocks.createRequest({
      route: {
        path: "/cases/:caseId",
        methods: { get: true }
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
        message: ROUTES[path]["get"]
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
        message: "Page was not found."
      })
    );
  });
});
