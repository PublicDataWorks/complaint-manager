import * as httpMocks from "node-mocks-http";
import UserAction from "../../../../client/testUtilities/userAction";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import editUserAction from "./editUserAction";

afterEach(async () => {
  await models.cases.destroy({ truncate: true, cascade: true });
  await models.user_action.destroy({
    truncate: true,
    cascade: true,
    force: true
  });
});

test("should update case status and recent activity in the db after user action edited", async () => {
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
    .withNotes("default notes")
    .withAction("Memo to file")
    .build();

  const createdUserAction = await models.user_action.create(userActionToCreate);

  const updatedUserAction = {
    action: "Miscellaneous",
    notes: "updated notes"
  };

  const request = httpMocks.createRequest({
    method: "PUT",
    headers: {
      authorization: "Bearer SOME_MOCK_TOKEN"
    },
    params: {
      caseId: createdCase.id,
      userActionId: createdUserAction.id
    },
    body: updatedUserAction,
    nickname: "TEST_USER_NICKNAME"
  });

  const response = httpMocks.createResponse();
  await editUserAction(request, response, jest.fn());

  const updatedCase = await models.cases.find({
    where: { id: createdCase.id }
  });

  expect(updatedCase).toEqual(
    expect.objectContaining({
      status: "Active"
    })
  );

  const updatedRecentActivity = await models.user_action.findAll({
    where: { caseId: createdCase.id }
  });
  expect(updatedRecentActivity).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: createdUserAction.id,
        caseId: createdUserAction.caseId,
        notes: updatedUserAction.notes,
        action: updatedUserAction.action
      })
    ])
  );
});
