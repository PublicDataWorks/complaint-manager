import models from "../../../policeDataManager/models";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import {
  ACCUSED,
  ALLEGATION_SEVERITY
} from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

describe("PUT /officers-allegations/:officerAllegationId", function () {
  let createdCase;

  beforeEach(async () => {
    createdCase = await createTestCaseWithoutCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test(
    "should reply a 400 if officer allegation doesnt exist ",
    suppressWinstonLogs(async () => {
      const token = buildTokenWithPermissions("case:edit", "TEST_NICKNAME");
      const nonExistantAllegationId = 9;
      const responsePromise = request(app)
        .put(
          `/api/cases/${createdCase.id}/officers-allegations/${nonExistantAllegationId}`
        )
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      await expectResponse(responsePromise, 400, {
        statusCode: 400,
        error: "Bad Request",
        message: BAD_REQUEST_ERRORS.OFFICER_ALLEGATION_NOT_FOUND,
        caseId: `${createdCase.id}`
      });
    })
  );

  test("should update officer allegation details", async () => {
    const token = buildTokenWithPermissions("case:edit", "TEST_NICKNAME");

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
      details: newDetailsValue,
      severity: ALLEGATION_SEVERITY.HIGH
    };

    const responsePromise = request(app)
      .put(
        `/api/cases/${createdCase.id}/officers-allegations/${officerAllegationToUpdate.id}`
      )
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(data);

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            allegations: [
              expect.objectContaining({
                details: newDetailsValue,
                severity: ALLEGATION_SEVERITY.HIGH,
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
