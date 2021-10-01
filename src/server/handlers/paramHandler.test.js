import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { handleCaseIdParam } from "./paramHandler";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import models from "../policeDataManager/models";
import Case from "../../sharedTestHelpers/case";

const Boom = require("boom");

describe("param handler", () => {
  let request, response, next;

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      }
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("throws an error when the case doesn't exist", async () => {
    const caseId = 20;
    request.params = { caseId: caseId };
    await handleCaseIdParam(request, response, next, caseId);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
    );
    expect(next).not.toHaveBeenCalledWith();
  });

  test("throws an error when case id not an integer", async () => {
    const caseId = "20aksjdljf";
    request.params = { caseId: caseId };
    await handleCaseIdParam(request, response, next, caseId);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
    );
    expect(next).not.toHaveBeenCalledWith();
  });

  test("throws error when case begins with zero", async () => {
    const caseId = "01";
    request.params = { caseId: caseId };
    await handleCaseIdParam(request, response, next, caseId);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
    );
    expect(next).not.toHaveBeenCalledWith();
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
      request.params = { caseId: archivedCase.id };
    });

    test("can edit case notes", async () => {
      request.method = "PUT";
      request.route = { path: "/cases/:caseId/case-notes/:caseNoteId" };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
    });

    test("can delete case notes", async () => {
      request.method = "DELETE";
      request.route = { path: "/cases/:caseId/case-notes/:caseNoteId" };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
    });

    test("can delete case notes", async () => {
      request.method = "DELETE";
      request.route = { path: "/cases/:caseId/case-notes/:caseNoteId" };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
    });

    test("calls next with error when receiving a post request for archived case other than case note", async () => {
      request.method = "POST";
      request.route = { path: "/cases/:caseId/status" };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).toBeCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE)
      );
      expect(next).not.toHaveBeenCalledWith();
    });

    test("calls next without error for archived case for case notes in route", async () => {
      request.method = "POST";
      request.route = { path: `/cases/:caseId/case-notes` };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });

    test("calls next without error for archived case for restore in route", async () => {
      request.method = "PUT";
      request.route = { path: `/cases/:caseId/restore` };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });

    test("calls next without an error when posting an attachment for an archived case", async () => {
      request.method = "POST";
      request.route = { path: "/cases/:caseId/attachments" };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });

    test("calls next without an error for an archived case", async () => {
      request.route = { path: `/cases/:caseId` };
      await handleCaseIdParam(request, response, next, archivedCase.id);

      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalled();
      expect(request.caseId).toEqual(archivedCase.id);
      expect(request.isArchived).toEqual(true);
    });
  });
});
