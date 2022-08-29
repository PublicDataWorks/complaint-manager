import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import models from "../../../policeDataManager/models";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { getCaseWithoutAssociations } from "../../getCaseHelpers";
import restoreArchivedCase from "./restoreArchivedCase";
const httpMocks = require("node-mocks-http");

describe("restoreArchivedCase handler", () => {
  const user = "TEST_USER_NICKNAME";
  let existingCase, request, response, next;

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    existingCase = await createTestCaseWithCivilian();
    await existingCase.destroy({ auditUser: user });

    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: user
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

  test("test that archived case is restored", async () => {
    await restoreArchivedCase(request, response, next);

    const restoredCase = await getCaseWithoutAssociations(existingCase.id);

    expect(restoredCase.isArchived).toBeFalsy();
  });
});
