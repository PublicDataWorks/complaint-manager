import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import request from "supertest";
import models from "../../models";

jest.mock("../cases/export/jobQueue");

describe("getClassifications", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns list of classifications to populate dropdown, sorted by Unable To Determine then alpha", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const fdi = await models.classification.create({
      initialism: "FDI",
      name: "Formal Disciplinary Investigation"
    });
    const utd = await models.classification.create({
      initialism: "UTD",
      name: "Unable to Determine"
    });
    const bwc = await models.classification.create({
      initialism: "BWC",
      name: "Body Worn Camera"
    });
    const expectedOrderedClassificationValues = [
      [utd.initialism, utd.id],
      [bwc.initialism, bwc.id],
      [fdi.initialism, fdi.id]
    ];

    await request(app)
      .get("/api/classifications")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expectedOrderedClassificationValues);
      });
  });
});
