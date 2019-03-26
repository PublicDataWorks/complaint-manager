import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import getWorkingCases from "./getWorkingCases";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";

const httpMocks = require("node-mocks-http");

jest.mock("../../auditDataAccess");

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
      params: {
        sortBy: "by",
        sortDirection: "direction"
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
      expect.anything()
    );
  });

  test("Should call auditDataAccess with auditDetails", async () => {
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
      "nickname",
      undefined,
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      expect.anything(),
      AUDIT_ACTION.DATA_ACCESSED,
      GET_CASES_AUDIT_DETAILS
    );
  });
});
