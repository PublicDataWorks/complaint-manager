import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../server";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

jest.mock("../export/jobQueue");

describe("changeStatus request", () => {
  let initialCase, token;
  beforeEach(async () => {
    initialCase = await createTestCaseWithoutCivilian();
    token = buildTokenWithPermissions("", "someone");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return an updated case when updating case status", async () => {
    await request(app)
      .put(`/api/cases/${initialCase.id}/status`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: CASE_STATUS.ACTIVE })
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: CASE_STATUS.ACTIVE
          })
        );
      });
  });

  test(
    "should return a bad request error code if invalid status is given",
    suppressWinstonLogs(async () => {
      await request(app)
        .put(`/api/cases/${initialCase.id}/status`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: CASE_STATUS.FORWARDED_TO_AGENCY })
        .expect(400);
    })
  );
});
