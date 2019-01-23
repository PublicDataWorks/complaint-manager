import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { handleCaseIdParam } from "./paramHandler";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import models from "../models";
import Case from "../../client/testUtilities/case";

const Boom = require("boom");

describe("param handler", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("throws an error when the case doesn't exist", async () => {
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

  test("calls next without an error for an archived case", async () => {
    const response = httpMocks.createResponse();
    const next = jest.fn();

    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withDeletedAt(new Date()),
      { auditUser: "test" }
    );
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: archivedCase.id }
    });

    await handleCaseIdParam(request, response, next, archivedCase.id);

    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalled();
    expect(request.caseId).toEqual(archivedCase.id);
  });
});
