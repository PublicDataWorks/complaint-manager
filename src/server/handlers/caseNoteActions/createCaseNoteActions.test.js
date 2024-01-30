import createCaseNoteActions from "./createCaseNoteActions";
import * as httpMocks from "node-mocks-http";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import models from "../../policeDataManager/models";
describe("Given a call is made to createCaseNoteActions", () => {
  test("should create one case note action", async () => {
    const response = httpMocks.createResponse();
    const next = jest.fn();
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { id: 1, name: "case-note-action-test" },
      params: {},
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
    });

    await createCaseNoteActions(request, response, next);
    const actual = await models.case_note_action.findOne({
      where: { name: "case-note-action-test" }
    });

    expect(actual).toEqual(
      expect.objectContaining({
        name: "case-note-action-test"
      })
    );
  });
});
