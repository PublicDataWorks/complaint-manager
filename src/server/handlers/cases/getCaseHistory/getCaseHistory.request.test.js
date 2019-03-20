import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
import request from "supertest";
import app from "../../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";

jest.mock("../export/jobQueue");

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

    await request(app)
      .get(`/api/cases/${existingCase.id}/case-history`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then(response => {
        expect(response.body).toEqual([
          expect.objectContaining({
            action: "Case Created",
            modelDescription: [{ "Case Reference": existingCase.caseReference }]
          })
        ]);
      });
  });
});
