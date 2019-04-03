import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../server";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  COMPLAINANT,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import Civilian from "../../../../client/testUtilities/civilian";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";
import moment from "moment";

jest.mock("../export/jobQueue");

describe("getWorkingCases", () => {
  let token;

  const sortBy = SORT_CASES_BY.CASE_REFERENCE;
  const sortDirection = DESCENDING;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /cases", () => {
    test("should audit data access", async () => {
      const responsePromise = request(app)
        .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);

      const audit = await models.action_audit.findOne({
        where: { subject: AUDIT_SUBJECT.ALL_WORKING_CASES }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.ALL_WORKING_CASES,
          user: "some_nickname"
        })
      );
    });

    test("should get all cases", async () => {
      const civilian = new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCreatedAt(new Date("2016-03-01"))
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
        .withCreatedAt(new Date("2018-02-01"))
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

      const responsePromise = request(app)
        .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          cases: expect.objectContaining({
            count: 1,
            rows: expect.arrayContaining([
              expect.objectContaining({
                complainantFirstName:
                  seededCase.complainantCivilians[0].firstName,
                complainantLastName:
                  seededCase.complainantCivilians[0].lastName,
                accusedFirstName: officer.firstName,
                complaintType: seededCase.complaintType,
                firstContactDate: moment(seededCase.firstContactDate).format(
                  "YYYY-MM-DD"
                ),
                status: CASE_STATUS.INITIAL,
                assignedTo: "tuser"
              })
            ])
          })
        })
      );
    });
  });
});
