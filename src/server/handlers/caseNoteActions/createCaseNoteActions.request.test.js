import app from "../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";

const actionName = "case-note-action-taken";

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

describe.skip("Given a request is made to the endpoint POST /case-note-actions", () => {
  describe("When the request succeeds", () => {
    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should create a new action", async () => {
      const token = buildTokenWithPermissions("", "TEST_NICKNAME");

      const actual = request(app)
        .post("/case-note-actions")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: actionName
        });

      await expectResponse(
        actual,
        201,
        expect.objectContaining({
          id: expect.anything(),
          name: actionName
        })
      );
    });
  });
});
