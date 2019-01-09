import archiveCase from "./archiveCase";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
const httpMocks = require("node-mocks-http");

describe("archiveCase handler", () => {
  const user = "TEST_USER_NICKNAME";
  let request, response, next, existingCase;

  beforeEach(async () => {
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);
    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: user
    });

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        case: existingCase
      },
      nickname: user
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should archive case if not currently archived", async () => {
    await archiveCase(request, response, next);

    const archivedCase = await models.cases.findById(existingCase.id, {
      auditUser: user,
      paranoid: false
    });

    expect(archivedCase.deletedAt).toBeTruthy();
  });

  describe("request tests", function() {});
});
