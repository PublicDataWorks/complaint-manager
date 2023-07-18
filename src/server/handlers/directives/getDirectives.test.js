import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../policeDataManager/models";
import request from "supertest";

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

describe("getDirectives", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns all directives that I deign to exist", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    await models.directive.create(
      { name: "directive 1" },
      { auditUser: "user" }
    );
    await models.directive.create(
      { name: "directive 2" },
      { auditUser: "user" }
    );

    const responsePromise = request(app)
      .get("/api/directives")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        expect.objectContaining({ name: "directive 1" }),
        expect.objectContaining({ name: "directive 2" })
      ])
    );
  });
});
