import app from "../../server";
import models from "../../models/index";
import moment from "moment/moment";
import Case from "../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import Officer from "../../../client/testUtilities/Officer";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import { CASE_STATUS, COMPLAINANT } from "../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";

describe("getCases", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /cases", () => {
    test("should get all cases", async () => {
      const civilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withNoAddress()
        .withFirstName("Robert")
        .build();

      const officer = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Jeff")
        .withOfficerNumber(123)
        .withId(undefined)
        .build();
      const createdOfficer = await models.officer.create(officer);

      const officerComplainant = new Officer.Builder()
        .defaultOfficer()
        .withOfficerNumber(321)
        .withFirstName("Marty")
        .withId(undefined)
        .build();
      const createdOfficerComplainant = await models.officer.create(
        officerComplainant
      );

      const accusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerAttributes(createdOfficer)
        .withNoSupervisor()
        .build();

      const complainantOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerAttributes(createdOfficerComplainant)
        .withNoSupervisor()
        .withRoleOnCase(COMPLAINANT)
        .build();

      const defaultCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withComplainantCivilians([civilian])
        .withAccusedOfficers([accusedOfficer])
        .withComplainantOfficers([complainantOfficer])
        .withAttachments(undefined)
        .withIncidentLocation(undefined)
        .withWitnessOfficers(undefined)
        .withWitnessCivilians(undefined)
        .build();

      const seededCase = await models.cases.create(defaultCase, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "someone"
          },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            auditUser: "someone"
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            auditUser: "someone"
          }
        ],
        auditUser: "someone"
      });

      await request(app)
        .get("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(response => {
          expect(response.body.cases).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                complainantCivilians: expect.arrayContaining([
                  expect.objectContaining({
                    firstName: seededCase.complainantCivilians[0].firstName,
                    lastName: seededCase.complainantCivilians[0].lastName,
                    phoneNumber: seededCase.complainantCivilians[0].phoneNumber,
                    email: seededCase.complainantCivilians[0].email
                  })
                ]),
                accusedOfficers: expect.arrayContaining([
                  expect.objectContaining({
                    firstName: officer.firstName
                  })
                ]),
                complainantOfficers: expect.arrayContaining([
                  expect.objectContaining({
                    fullName: seededCase.complainantOfficers[0].fullName
                  })
                ]),
                complainantType: seededCase.complainantType,
                createdAt: seededCase.createdAt.toISOString(),
                firstContactDate: moment(seededCase.firstContactDate).format(
                  "YYYY-MM-DD"
                ),
                status: CASE_STATUS.INITIAL,
                createdBy: "tuser",
                assignedTo: "tuser"
              })
            ])
          );
        });
    });
  });
});
