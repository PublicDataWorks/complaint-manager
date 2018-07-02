import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";

describe("DELETE /officers-allegations/:officerAllegationId", () => {
  afterEach(async function() {
    await cleanupDatabase();
  });

  test("should respond with 200 and updated case when successful", async () => {
    const token = buildTokenWithPermissions("", "TEST_NICKNAME");

    const createdCase = await createCaseWithoutCivilian();
    const anAllegation = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .build();

    const createdAllegation = await models.allegation.create(anAllegation, {
      auditUser: "someone"
    });
    const anOfficerAllegation = new OfficerAllegation.Builder()
      .defaultOfficerAllegation()
      .withId(undefined)
      .withDetails("old details")
      .withAllegationId(createdAllegation.id);

    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withUnknownOfficer()
      .withId(undefined)
      .withRoleOnCase(ACCUSED)
      .withOfficerAllegations([anOfficerAllegation])
      .build();

    await createdCase.createAccusedOfficer(accusedOfficer, {
      include: [
        {
          model: models.officer_allegation,
          as: "allegations",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });

    await createdCase.reload({
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          include: [{ model: models.officer_allegation, as: "allegations" }]
        }
      ]
    });

    const officerAllegationToRemove =
      createdCase.accusedOfficers[0].allegations[0];

    await request(app)
      .delete(`/api/officers-allegations/${officerAllegationToRemove.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                id: createdCase.accusedOfficers[0].id,
                allegations: []
              })
            ])
          })
        );
      });
  });
});
