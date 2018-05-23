import buildTokenWithPermissions from "../../../requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
import request from "supertest";
import app from "../../../server";

describe("GET /api/cases/:caseId/case-history", () => {
  afterEach(async () => {
    await models.cases.truncate({ cascade: true });
    await models.data_change_audit.truncate({ cascade: true });
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
            action: "Case created"
          })
        ]);
      });
  });
});
