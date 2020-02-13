import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../complaintManager/models";
import request from "supertest";
import app from "../../server";
import Case from "../../../client/complaintManager/testUtilities/case";

describe("getData", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns count of complaints broken down by Intake Source", async done => {
    const token = buildTokenWithPermissions("", "tuser");

    const emailIntakeSource = await models.intake_source.create({
      name: "Email"
    });
    const facebookIntakeSource = await models.intake_source.create({
      name: "Facebook"
    });
    const otherIntakeSource = await models.intake_source.create({
      name: "Other"
    });

    const createdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIntakeSourceId(emailIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withIntakeSourceId(otherIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    const expectedData = [
      { cases: "1", name: "Email" },
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await expectResponse(responsePromise, 200, expectedData);
    done();
  });
});
