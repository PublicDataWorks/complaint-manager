import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../../server";
import models from "../../../../models";
const gc = require("expose-gc/function");

describe("getRecommendedActions", function() {
  //temp fix for memory until we find the problem
  beforeAll(() => {
    gc();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it retrieves the recommended actions", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    const reassignedDecription =
      "Be temporarily or permanently reassigned from his/her current assignment";
    const trainingDecription = "Receive training regarding any issues noted";
    const insightDescription =
      "Receive supervisory interventions and monitoring - INSIGHT";

    const reassigned = await models.recommended_action.create({
      description: reassignedDecription
    });
    const training = await models.recommended_action.create({
      description: trainingDecription
    });
    const insight = await models.recommended_action.create({
      description: insightDescription
    });

    const expectedResponseBody = [
      { id: reassigned.id, description: reassigned.description },
      { id: training.id, description: training.description },
      { id: insight.id, description: insight.description }
    ];

    await request(app)
      .get("/api/recommended-actions")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expectedResponseBody);
      });
  });
});
