import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../complaintManager/models";
import request from "supertest";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import Case from "../../../../client/complaintManager/testUtilities/case";
import app from "../../../server";
import { response } from "express";

describe("executeQuery", () => {
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

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(emailIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(otherIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    const expectedData = [
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" },
      { cases: "1", name: "Email" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
    done();
  });

  test("throws an error when query param is not supported", async done => {
    const unknownQueryType = "unknown";
    const token = buildTokenWithPermissions("", "tuser");

    request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: unknownQueryType })
      .expect(400)
      .then(response => {
        expect(response.body.message).toContain(
          BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED
        );
        done();
      });
  });
});
