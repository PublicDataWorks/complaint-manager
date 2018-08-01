import { buildTokenWithPermissions } from "./testHelpers/requestTestHelpers";
import request from "supertest";
import app from "./server";

jest.mock("./config/features.json", () => [
  {
    id: "TEST_FEATURE",
    enabled: true
  },
  {
    id: "TEST_DISABLED_FEATURE",
    enabled: false
  }
]);

describe("featureToggleRouter", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "someone");
  });

  describe("GET /features", function() {
    test("should return toggles", async () => {
      await request(app)
        .get("/features")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body).toEqual({
            TEST_FEATURE: true,
            TEST_DISABLED_FEATURE: false
          });
        });
    });
  });
});
