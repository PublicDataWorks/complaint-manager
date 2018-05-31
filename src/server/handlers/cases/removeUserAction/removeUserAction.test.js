import * as httpMocks from "node-mocks-http";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import UserAction from "../../../../client/testUtilities/userAction";
import removeUserAction from "./removeUserAction";

describe("RemoveUserAction unit", () => {
  afterEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.user_action.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.data_change_audit.truncate();
  });

  test("should update case status and recent activity in the db after user action removed", async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus("Initial")
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const userActionToCreate = new UserAction.Builder()
      .defaultUserAction()
      .withCaseId(createdCase.id)
      .build();

    const createdUserAction = await models.user_action.create(
      userActionToCreate
    );

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        userActionId: createdUserAction.id
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    await removeUserAction(request, response, jest.fn());

    const updatedCase = await models.cases.findAll({
      where: { id: createdCase.id }
    });

    expect(updatedCase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "Active"
        })
      ])
    );

    const updatedRecentActivity = await models.user_action.findAll({
      where: { caseId: updatedCase.id }
    });
    expect(updatedRecentActivity).toEqual([]);
  });
});
