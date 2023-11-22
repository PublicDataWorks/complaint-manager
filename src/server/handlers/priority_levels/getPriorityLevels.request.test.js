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

describe("Given the priority_levels table has values When a request is made to /priority-levels", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("then it should return a list of priority levels sorted in alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const expected = await Promise.all([
      models.priority_levels.create({
        name: "Priority Level Test 1"
      }),
      models.priority_levels.create({
        name: "Priority Level Test 2"
      }),
      models.priority_levels.create({
        name: "Priority Level Test 3"
      })
    ]).then(priorityLevels =>
      priorityLevels.map(priorityLevel => ({
        name: priorityLevel.name,
        id: priorityLevel.id
      }))
    );

    const responsePromise = request(app)
      .get("/api/priority-levels")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expected);
  });
});
