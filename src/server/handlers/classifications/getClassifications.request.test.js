import { buildTokenWithPermissions } from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import request from "supertest";
import models from "../../models";

describe("getClassifications", () => {
  test("returns list of classifications to populate dropdown", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    const classifications = await models.classification.findAll({
      order: [["abbreviation", "asc"]]
    });
    const expectedClassifications = classifications.map(classification => {
      return [
        classification.id,
        `${classification.abbreviation} - ${classification.name}`
      ];
    });

    await request(app)
      .get("/api/classifications")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expectedClassifications);
      });
  });
});
