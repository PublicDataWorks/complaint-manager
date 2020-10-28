import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../policeDataManager/models";
import request from "supertest";

describe("getCivilianTitles", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns a list of civilian titles to populate dropdown with N/A on top", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const msTitle = await models.civilian_title.create({ name: "Ms." });
    const doctorTitle = await models.civilian_title.create({ name: "Dr." });
    const notApplicableTitle = await models.civilian_title.create({
      name: "N/A"
    });
    const mrTitle = await models.civilian_title.create({
      name: "Mr."
    });

    const expectedOrderedCivilianTitles = [
      [notApplicableTitle.name, notApplicableTitle.id],
      [doctorTitle.name, doctorTitle.id],
      [mrTitle.name, mrTitle.id],
      [msTitle.name, msTitle.id]
    ];
    const responsePromise = request(app)
      .get("/api/civilian-titles")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedOrderedCivilianTitles);
  });
});
