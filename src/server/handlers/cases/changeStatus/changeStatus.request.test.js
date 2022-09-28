import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../server";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../../../policeDataManager/models";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

jest.mock(
  "../../../getFeaturesAsync",
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

describe("changeStatus request", () => {
  let initialCase, token;

  beforeEach(async () => {
    await seedStandardCaseStatuses();

    initialCase = await createTestCaseWithoutCivilian();
    token = buildTokenWithPermissions("letter:setup", "someone");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return an updated case when updating case status", async () => {
    const responsePromise = request(app)
      .put(`/api/cases/${initialCase.id}/status`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: CASE_STATUS.ACTIVE });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({ status: CASE_STATUS.ACTIVE })
    );
  });

  test(
    "should return a bad request error code if invalid status is given",
    suppressWinstonLogs(async () => {
      const responsePromise = request(app)
        .put(`/api/cases/${initialCase.id}/status`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: CASE_STATUS.FORWARDED_TO_AGENCY });

      await expectResponse(responsePromise, 400);
    })
  );
});
