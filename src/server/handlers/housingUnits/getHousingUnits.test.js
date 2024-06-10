import {
  buildTokenWithPermissions,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../server";

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

describe("When a request is made to get all housing units by facilityId", () => {
  test("it should return 200", async () => {
    const token = buildTokenWithPermissions("", "user");

    const responsePromise = request(app)
      .get("/api/housing-units")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ facilityId: 1 });

    await expectResponse(responsePromise, 200, {});
  });
});
