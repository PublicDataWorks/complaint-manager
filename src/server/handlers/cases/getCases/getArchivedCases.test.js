import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import getArchivedCases from "./getArchivedCases";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../audits/auditDataAccess";

jest.mock("../../audits/auditDataAccess");
jest.mock("./getCases");

getCases.mockImplementation((caseType, sortBy, sortDirection, transaction) => {
  return "MOCK_GET_CASES";
});

const httpMocks = require("node-mocks-http");

describe("getArchivedCases", () => {
  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
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
      2,
      undefined
    );
  });
  describe("auditing", () => {
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

    test("should audit data access", async () => {
      await getArchivedCases(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        auditUser,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        GET_CASES_AUDIT_DETAILS,
        expect.anything()
      );
    });
  });
});
