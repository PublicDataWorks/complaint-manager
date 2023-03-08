import archiveCase from "./archiveCase";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { getCaseWithoutAssociations } from "../../getCaseHelpers";

const httpMocks = require("node-mocks-http");

describe("archiveCase handler", () => {
  const user = "TEST_USER_NICKNAME";
  let request, response, next, existingCase;

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);
    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: user
    });

    request = httpMocks.createRequest({
      method: "DELETE",
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

  test("should archive case if not currently archived", async () => {
    await archiveCase(request, response, next);

    const archivedCase = await getCaseWithoutAssociations(existingCase.id);

    expect(archivedCase.isArchived).toBeTruthy();
  });
});
