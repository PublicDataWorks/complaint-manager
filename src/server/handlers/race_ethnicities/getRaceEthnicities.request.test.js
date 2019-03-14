import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../models";
import request from "supertest";

jest.mock("../cases/export/jobQueue");

describe("getRaceEthnicities", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns list of race & ethnicities to populate dropdown sorted by alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const unknownRaceEthnicity = await models.race_ethnicity.create({
      name: "Unknown"
    });
    const samoanRaceEthnicity = await models.race_ethnicity.create({
      name: "Samoan"
    });
    const filipinoRaceEthnicity = await models.race_ethnicity.create({
      name: "Filipino"
    });

    const expectedOrderedRaceEthnicities = [
      [filipinoRaceEthnicity.name, filipinoRaceEthnicity.id],
      [samoanRaceEthnicity.name, samoanRaceEthnicity.id],
      [unknownRaceEthnicity.name, unknownRaceEthnicity.id]
    ];

    const responsePromise = request(app)
      .get("/api/race-ethnicities")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedOrderedRaceEthnicities);
  });
});
