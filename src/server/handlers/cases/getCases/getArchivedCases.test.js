import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getArchivedCases from "./getArchivedCases";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../auditDataAccess";

jest.mock("../../legacyAuditDataAccess");
jest.mock("../../auditDataAccess");
jest.mock("./getCases");

getCases.mockImplementation((caseType, sortBy, sortDirection, transaction) => {
  return "MOCK_GET_CASES";
});

const httpMocks = require("node-mocks-http");

describe("getArchivedCases", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should call getCases with sortBy and sortDirection params", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      fflip: mockFflipObject({
        caseDashboardPaginationFeature: true
      }),
      query: {
        page: 2,
        sortBy: "by",
        sortDirection: "direction"
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getArchivedCases(request, response, next);

    expect(getCases).toHaveBeenCalledWith(
      CASES_TYPE.ARCHIVED,
      "by",
      "direction",
      expect.anything(),
      2
    );
  });
  describe("test audits with newAuditFeature off", () => {
    const auditUser = "testUser";
    let existingArchivedCase, request, response, next;

    beforeEach(async () => {
      existingArchivedCase = await createTestCaseWithCivilian();
      await existingArchivedCase.destroy({ auditUser: auditUser });

      request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        fflip: mockFflipObject({
          newAuditFeature: false
        }),
        nickname: auditUser
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    test("should audit data access", async () => {
      await getArchivedCases(request, response, next);

      expect(legacyAuditDataAccess).toHaveBeenCalledWith(
        auditUser,
        undefined,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        expect.anything(),
        AUDIT_ACTION.DATA_ACCESSED,
        GET_CASES_AUDIT_DETAILS
      );
    });
  });
  describe("test audits with newAuditFeature on", () => {
    const auditUser = "testUser";
    let existingArchivedCase, request, response, next;
    beforeEach(async () => {
      existingArchivedCase = await createTestCaseWithCivilian();
      await existingArchivedCase.destroy({ auditUser: auditUser });

      request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        fflip: mockFflipObject({
          newAuditFeature: true
        }),
        nickname: auditUser
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    test("should audit data access", async () => {
      await getArchivedCases(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        auditUser,
        null,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        GET_CASES_AUDIT_DETAILS,
        expect.anything()
      );
    });
  });
});
