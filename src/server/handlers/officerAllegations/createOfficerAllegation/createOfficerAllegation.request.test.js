import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import Officer from "../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import { ALLEGATION_SEVERITY } from "../../../../sharedUtilities/constants";

describe("POST /cases/:caseId/cases-officers/:caseOfficerId/officers-allegations", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should create officer allegation", async () => {
    const token = buildTokenWithPermissions("", "TEST_NICKNAME");

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();

    const officer = await models.officer.create(officerAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .build();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withAccusedOfficers([caseOfficerAttributes])
      .build();

    const newCase = await models.cases.create(caseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ]
    });

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .build();

    const allegation = await models.allegation.create(allegationAttributes);

    const allegationDetails = "test details";

    const responsePromise = request(app)
      .post(
        `/api/cases/${newCase.id}/cases-officers/${newCase.accusedOfficers[0].id}/officers-allegations`
      )
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        allegationId: allegation.id,
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW
      });

    await expectResponse(
      responsePromise,
      201,
      expect.objectContaining({
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            allegations: [
              expect.objectContaining({
                details: allegationDetails,
                severity: ALLEGATION_SEVERITY.LOW,
                allegation: expect.objectContaining({
                  rule: allegation.rule,
                  paragraph: allegation.paragraph,
                  directive: allegation.directive
                })
              })
            ]
          })
        ])
      })
    );
  });
});
