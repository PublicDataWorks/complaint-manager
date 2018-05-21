import models from "../../../models";
import app from "../../../server";
import request from "supertest";
import buildTokenWithPermissions from "../../../requestTestHelpers";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";

describe("PUT /cases/:id/cases-officers/:caseOfficerId", () => {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await models.address.destroy({ truncate: true, cascade: true });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.officer.destroy({ truncate: true, cascade: true });
  });

  test("it updates the thing", async () => {
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

    const fieldsToUpdate = { notes: "Some very updated notes" };
    await request(app)
      .put(
        `/api/cases/${createdCase.id}/cases-officers/${
          createdCase.accusedOfficers[0].id
        }`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(fieldsToUpdate)
      .expect(200)
      .then(response =>
        expect(response.body).toEqual(
          expect.objectContaining({
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                notes: fieldsToUpdate.notes
              })
            ])
          })
        )
      );
  });
});
