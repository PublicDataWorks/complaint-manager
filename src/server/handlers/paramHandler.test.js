import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { handleCaseIdParam } from "./paramHandler";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

const Boom = require("boom");

describe("param handler", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("throws an error when the case doesn't exist ", async () => {
    const caseId = 20;
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: caseId }
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    await handleCaseIdParam(request, response, next, caseId);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
    );
  });
});
