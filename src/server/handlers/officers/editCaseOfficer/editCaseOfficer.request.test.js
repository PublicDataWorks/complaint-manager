import models from "../../../policeDataManager/models";
import app from "../../../server";
import request from "supertest";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Case from "../../../../sharedTestHelpers/case";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";

describe("PUT /cases/:id/cases-officers/:caseOfficerId", () => {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it updates the case officer", async () => {
    const existingOfficer = new Officer.Builder()
      .defaultOfficer()
      .withOfficerNumber(123)
      .build();
    const createdOfficer = await models.officer.create(existingOfficer);

    const existingCaseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(createdOfficer)
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
          auditUser: "someone"
        }
      ],
      auditUser: "someone",
      returning: true
    });

    const fieldsToUpdate = {
      notes: "Some very updated notes",
      roleOnCase: ACCUSED
    };
    const responsePromise = request(app)
      .put(
        `/api/cases/${createdCase.id}/cases-officers/${createdCase.accusedOfficers[0].id}`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(fieldsToUpdate);

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            notes: fieldsToUpdate.notes
          })
        ])
      })
    );
  });
});
