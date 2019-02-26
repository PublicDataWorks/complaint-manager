import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getArchivedCases from "./getArchivedCases";
import auditDataAccess from "../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getCases from "./getCases";

jest.mock("../../auditDataAccess");
jest.mock("./getCases");

getCases.mockImplementation((caseType, transaction, auditDetails) => {
  auditDetails.mock = {
    attributes: ["mockAttribute"]
  };
});

const httpMocks = require("node-mocks-http");

describe("getArchivedCases", () => {
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
      { mock: { attributes: ["mockAttribute"] } }
    );
  });
});
