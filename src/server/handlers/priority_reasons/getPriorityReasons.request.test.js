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

describe("Given the priority_reasons table has values When a request is made to /priority-reasons", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("then it should return a list of priority reasons in alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const expected = await Promise.all([
      models.priority_reasons.create({
        name: "Reason Test 1"
      }),
      models.priority_reasons.create({
        name: "Reason Test 2"
      }),
      models.priority_reasons.create({
        name: "Reason Test 3"
      })
    ]).then(priorityReasons =>
      priorityReasons.map(priorityReason => ({
        name: priorityReason.name,
        id: priorityReason.id
      }))
    );

    const responsePromise = request(app)
      .get("/api/priority-reasons")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expected);
  });
});
