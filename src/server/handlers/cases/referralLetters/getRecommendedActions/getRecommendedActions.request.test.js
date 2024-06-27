import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../../server";
import models from "../../../../policeDataManager/models";

jest.mock(
  "../../../../getFeaturesAsync",
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

describe("getRecommendedActions", function () {
  jest.setTimeout(60000);
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it retrieves the recommended actions", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    const reassignedDecription =
      "Be temporarily or permanently reassigned from his/her current assignment";
    const trainingDecription = "Receive training regarding any issues noted";

    const reassigned = await models.recommended_action.create({
      description: reassignedDecription
    });
    const training = await models.recommended_action.create({
      description: trainingDecription
    });

    const expectedResponseBody = [
      { id: reassigned.id, description: reassigned.description },
      { id: training.id, description: training.description }
    ];

    const responsePromise = request(app)
      .get("/api/recommended-actions")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponseBody);
  });
});
