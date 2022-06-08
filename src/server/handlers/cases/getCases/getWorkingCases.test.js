import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import getWorkingCases from "./getWorkingCases";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../audits/auditDataAccess";

const httpMocks = require("node-mocks-http");

jest.mock("../../audits/auditDataAccess");

jest.mock("./getCases");

getCases.mockImplementation((caseType, sortBy, sortDirection, transaction) => {
  return "MOCK_GET_CASES";
});

describe("getWorkingCases", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should call getCases with sortBy and sortDirection params", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      query: {
        sortBy: "by",
        sortDirection: "direction",
        page: 2
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getWorkingCases(request, response, next);

    expect(getCases).toHaveBeenCalledWith(
      CASES_TYPE.WORKING,
      "by",
      "direction",
      expect.anything(),
      2,
      undefined
    );
  });

  describe("auditing", () => {
    test("should call auditDataAccess with correct arguments", async () => {
      const request = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: "Bearer token"
        },
        nickname: "nickname"
      });

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await getWorkingCases(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_WORKING_CASES,
        GET_CASES_AUDIT_DETAILS,
        expect.anything()
      );
    });
  });
});
