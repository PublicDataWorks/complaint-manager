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

  test("returns list of priority levels to populate dropdown", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const priorityLevelOne = await models.priority_levels.create({
      name: "Priority Level One"
    });
    const priorityLevelTwo = await models.priority_levels.create({
      name: "Priority Level Two"
    });
    const priorityLevelThree = await models.priority_levels.create({
      name: "Priority Level Three"
    });

    const expectedPriorityLevelValues = [
      [priorityLevelOne.name, priorityLevelOne.id],
      [priorityLevelTwo.name, priorityLevelTwo.id],
      [priorityLevelThree.name, priorityLevelThree.id]
    ];

    const responsePromise = request(app)
      .get("/api/priority-levels")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedPriorityLevelValues);
  });
});
