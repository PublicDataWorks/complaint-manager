import {
  buildTokenWithPermissions,
  expectResponse
} from "./testHelpers/requestTestHelpers";
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

jest.mock("./handlers/cases/export/jobQueue");

describe("featureToggleRouter", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "someone");
  });

  describe("GET /features", function() {
    test("should return toggles", async () => {
      const responsePromise = request(app)
        .get("/features")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200, {
        TEST_FEATURE: true,
        TEST_DISABLED_FEATURE: false
      });
    });
  });
});
