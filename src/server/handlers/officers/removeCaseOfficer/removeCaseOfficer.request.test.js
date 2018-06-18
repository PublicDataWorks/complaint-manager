import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../requestTestHelpers";
import app from "../../../server";
import request from "supertest";
import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import { COMPLAINANT } from "../../../../sharedUtilities/constants";
import winston from "winston";

describe("DELETE /cases/:caseId/cases-officers/:caseOfficerId", () => {
  let token;
  const nickname = "tuser";

  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
    winston.remove(winston.transports.Console);
  });

  afterEach(async () => {
    await cleanupDatabase();
    winston.add(winston.transports.Console, {
      json: true,
      colorize: true
    });
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

    await request(app)
      .delete(
        `/api/cases/${createdCase.id}/cases-officers/${
          createdComplainantOfficer1.id
        }`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            complainantOfficers: expect.arrayContaining([
              expect.objectContaining({
                id: createdComplainantOfficer2.id
              })
            ])
          })
        );

        const complainantOfficers = response.body.complainantOfficers;
        expect(complainantOfficers.length).toEqual(1);
      });
  });

  test("should respond with 400 status and error message if caseofficer does not exist", async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    const createdCase = await models.cases.create(caseAttributes, {
      auditUser: nickname
    });
    const invalidId = 1;

    await request(app)
      .delete(`/api/cases/${createdCase.id}/cases-officers/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .expect(400)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "Case Officer requested for removal does not exist."
          })
        );
      });
  });
});
