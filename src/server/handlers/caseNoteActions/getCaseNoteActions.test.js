import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../complaintManager/models";
import getCaseNoteActions from "./getCaseNoteActions";

const httpMocks = require("node-mocks-http");

describe("getCaseNoteActions", () => {
  let request, response, next;

  beforeEach(() => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns list of case notes action to populate dropdown", async () => {
    const action1 = await models.case_note_action.create({
      name: "Checked status"
    });
    const action2 = await models.case_note_action.create({
      name: "Contacted complainant support person"
    });

    await getCaseNoteActions(request, response);

    expect(response._getData().length).toEqual(2);
    expect(response._getData()).toEqual(
      expect.arrayContaining([
        [action1.name, action1.id],
        [action2.name, action2.id]
      ])
    );
  });
});
