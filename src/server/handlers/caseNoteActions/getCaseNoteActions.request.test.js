import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import getCaseNoteActions from "./getCaseNoteActions";
import request from "supertest";
import app from "../../server";

const MOCK_CASE_NOTE_ACTION_VALUES = [
  ["case_note_action_name", "case_note_action_id"]
];

jest.mock(
  "../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

jest.mock("./getCaseNoteActions", () =>
  jest.fn((request, response, next) => {
    response.status(200).send(MOCK_CASE_NOTE_ACTION_VALUES);
  })
);

describe("getCaseNoteActions", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("hits endpoint that calls getCaseNoteActions", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const responsePromise = request(app)
      .get("/api/case-note-actions")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, MOCK_CASE_NOTE_ACTION_VALUES);
    expect(getCaseNoteActions).toHaveBeenCalled();
  });
});
