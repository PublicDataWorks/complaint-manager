import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getArchivedCases from "./getArchivedCases";
import auditDataAccess from "../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";

jest.mock("../../auditDataAccess");
jest.mock("./getCases");
jest.mock(
  "../../../checkFeatureToggleEnabled",
  () => (request, featureName) => {
    return featureName === "caseDashboardPagination";
  }
);

getCases.mockImplementation((caseType, sortBy, sortDirection, transaction) => {
  return "MOCK_GET_CASES";
});

const httpMocks = require("node-mocks-http");

describe("getArchivedCases", () => {
  test("should call getCases with sortBy and sortDirection params", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: {
        sortBy: "by",
        sortDirection: "direction",
        page: 2
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
  describe("test audits", () => {
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
        nickname: auditUser
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should audit data access", async () => {
      await getArchivedCases(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        auditUser,
        undefined,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        expect.anything(),
        AUDIT_ACTION.DATA_ACCESSED,
        GET_CASES_AUDIT_DETAILS
      );
    });
  });
});
