import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../models";
import request from "supertest";
import app from "../../server";

describe("getClassifications", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return sorted classification options, sorted by alpha with Decline at end", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const useOfForce = await models.new_classifications.create({
      name: "Use of Force",
      message: "forceful use",
      id: 1
    });
    const decline = await models.new_classifications.create({
      name: "Declines to classify",
      message: "no thank you",
      id: 2
    });
    const criminalMisconduct = await models.new_classifications.create({
      name: "Criminal Misconduct",
      message: "misconducting criminally",
      id: 3
    });

    const expectedResponseOrder = [
      [useOfForce.name, useOfForce.message, useOfForce.id],
      [
        criminalMisconduct.name,
        criminalMisconduct.message,
        criminalMisconduct.id
      ],
      [decline.name, decline.message, decline.id]
    ];

    const responsePromise = request(app)
      .get("/api/new-classifications")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponseOrder);
  });
});
