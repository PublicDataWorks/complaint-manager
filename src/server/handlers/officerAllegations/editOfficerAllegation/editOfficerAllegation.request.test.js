import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../modelTestHelpers/helpers";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";

describe("PUT /officers-allegations/:officerAllegationId", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should reply a 404 if officer allegation doesnt exist ", async () => {
    const token = buildTokenWithPermissions("", "TEST_NICKNAME");
    const nonExistantAllegationId = 9;
    await request(app)
      .put(`/api/officers-allegations/${nonExistantAllegationId}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(404)
      .then(response => {
        expect(response.body).toEqual({
          statusCode: 404,
          error: "Not Found",
          message: `Officer Allegation does not exist`
        });
      });
  });

  test("should update officer allegation details", async () => {
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

    const officerAllegationToUpdate =
      createdCase.accusedOfficers[0].allegations[0];

    const newDetailsValue = "new details";

    const data = {
      details: newDetailsValue
    };

    await request(app)
      .put(`/api/officers-allegations/${officerAllegationToUpdate.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            accusedOfficers: expect.arrayContaining([
              expect.objectContaining({
                id: expect.anything(),
                allegations: [
                  expect.objectContaining({
                    details: newDetailsValue,
                    allegation: expect.objectContaining({
                      rule: createdAllegation.rule,
                      paragraph: createdAllegation.paragraph,
                      directive: createdAllegation.directive
                    })
                  })
                ]
              })
            ])
          })
        );
      });
  });
});
