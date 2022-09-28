import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
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

describe("getClassifications", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return sorted classification options, sorted by alpha with Decline at end", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const useOfForce = await models.classification.create({
      name: "Use of Force",
      message: "forceful use",
      id: 1
    });
    const decline = await models.classification.create({
      name: "Declines to classify",
      message: "no thank you",
      id: 2
    });
    const criminalMisconduct = await models.classification.create({
      name: "Criminal Misconduct",
      message: "misconducting criminally",
      id: 3
    });

    const expectedResponseOrder = [
      { name: useOfForce.name, message: useOfForce.message, id: useOfForce.id },
      {
        name: criminalMisconduct.name,
        message: criminalMisconduct.message,
        id: criminalMisconduct.id
      },
      { name: decline.name, message: decline.message, id: decline.id }
    ];

    const responsePromise = request(app)
      .get("/api/classifications")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponseOrder);
  });
});
