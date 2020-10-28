import Case from "../../../../sharedTestHelpers/case";
import models from "../../../policeDataManager/models/index";
import request from "supertest";
import app from "../../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";

describe("GET /api/cases/:caseId/case-history", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it returns the case history ordered by createdAt desc", async () => {
    const token = buildTokenWithPermissions("", "bobNickname");
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    const existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const responsePromise = request(app)
      .get(`/api/cases/${existingCase.id}/case-history`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    await expectResponse(responsePromise, 200, [
      expect.objectContaining({
        action: "Case Created",
        modelDescription: [{ "Case Reference": existingCase.caseReference }]
      })
    ]);
  });
});
