import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../policeDataManager/models";
import request from "supertest";

describe("getHowDidYouHearAboutUsSources", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns list of intake sources to populate dropdown sorted by alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const emailIntakeSource = await models.intake_source.create({
      name: "Email"
    });
    const otherIntakeSource = await models.intake_source.create({
      name: "Other"
    });
    const remoteComplaintIntakeSiteSource = await models.intake_source.create({
      name: "Remote Complaint Intake Site"
    });

    const expectedOrderedIntakeSourceValues = [
      [emailIntakeSource.name, emailIntakeSource.id],
      [otherIntakeSource.name, otherIntakeSource.id],
      [remoteComplaintIntakeSiteSource.name, remoteComplaintIntakeSiteSource.id]
    ];

    const responsePromise = request(app)
      .get("/api/intake-sources")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expectedOrderedIntakeSourceValues
    );
  });
});
