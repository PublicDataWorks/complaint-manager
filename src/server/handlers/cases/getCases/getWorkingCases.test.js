import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import getWorkingCases from "./getWorkingCases";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const httpMocks = require("node-mocks-http");

jest.mock("../../legacyAuditDataAccess");

jest.mock("./getCases");

jest.mock("../../../checkFeatureToggleEnabled");

getCases.mockImplementation((caseType, sortBy, sortDirection, transaction) => {
  return "MOCK_GET_CASES";
});

checkFeatureToggleEnabled.mockImplementation((request, featureName) => {
  return featureName === "caseDashboardPaginationFeature";
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
      2
    );
    expect(checkFeatureToggleEnabled).toHaveBeenCalledWith(
      request,
      "caseDashboardPaginationFeature"
    );
  });

  test("Should call legacyAuditDataAccess with auditDetails", async () => {
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

    expect(legacyAuditDataAccess).toHaveBeenCalledWith(
      "nickname",
      undefined,
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      expect.anything(),
      AUDIT_ACTION.DATA_ACCESSED,
      GET_CASES_AUDIT_DETAILS
    );
  });
});
