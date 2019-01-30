import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { handleCaseIdParam } from "./paramHandler";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import models from "../models";
import Case from "../../client/testUtilities/case";

const Boom = require("boom");

describe("param handler", () => {
  let response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

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
    await handleCaseIdParam(request, response, next, caseId);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
    );
  });

  describe("archived cases", () => {
    let archivedCase;

    beforeEach(async () => {
      archivedCase = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withId(undefined)
          .withDeletedAt(new Date()),
        { auditUser: "test" }
      );
    });

    test("calls next with error when receiving a post request for archived case other than case note", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: archivedCase.id },
        route: {
          path: "/cases/:caseId/status"
        }
      });

      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).toBeCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE)
      );
    });

    test("calls next without error for archived case for case notes in route", async () => {
      const request = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: archivedCase.id },
        route: { path: `/cases/:caseId/case-notes` }
      });

      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });

    test("calls next without error for archived case for restore in route", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: archivedCase.id },
        route: { path: `/cases/:caseId/restore` }
      });

      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });

    test("calls next without an error for an archived case", async () => {
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: archivedCase.id },
        route: { path: `/cases/:caseId` }
      });

      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });
  });
});
