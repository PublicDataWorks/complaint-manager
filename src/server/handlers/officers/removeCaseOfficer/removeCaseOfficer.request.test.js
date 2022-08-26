import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import app from "../../../server";
import request from "supertest";
import models from "../../../policeDataManager/models";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Officer from "../../../../sharedTestHelpers/Officer";
import { COMPLAINANT } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

describe("DELETE /cases/:caseId/cases-officers/:caseOfficerId", () => {
  let token;
  const nickname = "tuser";

  beforeEach(() => {
    token = buildTokenWithPermissions("case:edit", "tuser");

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should respond with 200 and updated case when removing officer", async () => {
    const officer1Attributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withWindowsUsername(1)
      .withOfficerNumber(1)
      .withSupervisorOfficerNumber(undefined)
      .build();
    const officer2Attributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withWindowsUsername(2)
      .withOfficerNumber(2)
      .withSupervisorOfficerNumber(undefined)
      .build();
    const createdOfficer1 = await models.officer.create(officer1Attributes);
    const createdOfficer2 = await models.officer.create(officer2Attributes);

    const caseOfficer1Attributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(undefined)
      .withOfficerId(createdOfficer1.id)
      .withRoleOnCase(COMPLAINANT)
      .build();
    const caseOfficer2Attributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(undefined)
      .withOfficerId(createdOfficer2.id)
      .withRoleOnCase(COMPLAINANT)
      .build();
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantOfficers([caseOfficer1Attributes, caseOfficer2Attributes])
      .build();

    const createdCase = await models.cases.create(caseAttributes, {
      include: {
        model: models.case_officer,
        as: "complainantOfficers",
        auditUser: nickname
      },
      auditUser: nickname
    });
    const createdComplainantOfficer1 = createdCase.complainantOfficers[0];
    const createdComplainantOfficer2 = createdCase.complainantOfficers[1];

    const responsePromise = request(app)
      .delete(
        `/api/cases/${createdCase.id}/cases-officers/${createdComplainantOfficer1.id}`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        complainantOfficers: [
          expect.objectContaining({
            id: createdComplainantOfficer2.id
          })
        ]
      })
    );
  });

  test(
    "should respond with 400 status and error message if caseofficer does not exist",
    suppressWinstonLogs(async () => {
      const caseAttributes = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .build();

      const createdCase = await models.cases.create(caseAttributes, {
        auditUser: nickname
      });
      const invalidId = 1;

      const responsePromise = request(app)
        .delete(`/api/cases/${createdCase.id}/cases-officers/${invalidId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json");

      await expectResponse(
        responsePromise,
        400,
        expect.objectContaining({
          message: BAD_REQUEST_ERRORS.REMOVE_CASE_OFFICER_ERROR
        })
      );
    })
  );
});
