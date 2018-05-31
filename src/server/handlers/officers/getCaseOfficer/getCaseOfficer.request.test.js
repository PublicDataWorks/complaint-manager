import buildTokenWithPermissions from "../../../requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import app from "../../../server";
import request from "supertest";

describe("GET /cases/:caseId/cases-officers/:caseOfficerId", () => {
  let token;

  afterEach(async () => {
    await models.address.destroy({ truncate: true, cascade: true });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.data_change_audit.truncate();
  });

  test("should return back a case officer", async () => {
    token = buildTokenWithPermissions("", "TEST_NICKNAME");

    const existingOfficer = new Officer.Builder().defaultOfficer().build();
    const existingCaseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficer(existingOfficer)
      .build();
    const existingCase = new Case.Builder()
      .defaultCase()
      .withAccusedOfficers([existingCaseOfficer])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(existingCase, {
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          include: [models.officer]
        }
      ],
      auditUser: "someone",
      returning: true
    });

    await request(app)
      .get(
        `/api/cases/${createdCase.id}/cases-officers/${
          createdCase.accusedOfficers[0].id
        }`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then(response =>
        expect(response.body).toEqual(
          expect.objectContaining({
            id: createdCase.accusedOfficers[0].id,
            officer: expect.objectContaining({
              id: createdCase.accusedOfficers[0].officerId
            })
          })
        )
      );
  });
});
