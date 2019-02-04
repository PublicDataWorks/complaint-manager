import app from "../../../server";
import models from "../../../models";
import moment from "moment/moment";
import Case from "../../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../../client/testUtilities/civilian";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  ACCUSED,
  AUDIT_TYPE,
  CASE_STATUS,
  COMPLAINANT
} from "../../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";

describe("getCases", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /cases", () => {
    test("should audit data access", async () => {
      await request(app)
        .get("/api/cases")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const audit = await models.action_audit.find({
        where: { subject: AUDIT_SUBJECT.ALL_CASES }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.ALL_CASES,
          user: "some_nickname"
        })
      );
    });

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
                complaintType: seededCase.complaintType,
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

    test("should return complainants and accusedOfficers sorted by createdAt ascending", async () => {
      const complainantOfficers = [
        await createCaseOfficer(COMPLAINANT, 234, new Date("2018-08-01")),
        await createCaseOfficer(COMPLAINANT, 124, new Date("2018-01-01"))
      ];
      const civilians = [
        createComplainantCivilian(new Date("2018-08-01")),
        createComplainantCivilian(new Date("2018-01-01"))
      ];
      const accusedOfficers = [
        await createCaseOfficer(ACCUSED, 235, new Date("2018-08-01")),
        await createCaseOfficer(ACCUSED, 125, new Date("2018-01-01"))
      ];

      const defaultCase = new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withComplainantCivilians(civilians)
        .withComplainantOfficers(complainantOfficers)
        .withAccusedOfficers(accusedOfficers)
        .build();

      await models.cases.create(defaultCase, {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            auditUser: "someone"
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            auditUser: "someone"
          },
          {
            model: models.case_officer,
            as: "accusedOfficers",
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
          expect(
            response.body.cases[0].complainantOfficers[0].createdAt <
              response.body.cases[0].complainantOfficers[1].createdAt
          ).toEqual(true);
          expect(
            response.body.cases[0].complainantCivilians[0].createdAt <
              response.body.cases[0].complainantCivilians[1].createdAt
          ).toEqual(true);
          expect(
            response.body.cases[0].accusedOfficers[0].createdAt <
              response.body.cases[0].accusedOfficers[1].createdAt
          ).toEqual(true);
        });
    });
  });
});

const createComplainantCivilian = dateCreated => {
  return new Civilian.Builder()
    .defaultCivilian()
    .withId(undefined)
    .withRoleOnCase(COMPLAINANT)
    .withCreatedAt(dateCreated);
};

const createCaseOfficer = async (role, officerNumber, dateCreated) => {
  const officerAttributes = new Officer.Builder()
    .defaultOfficer()
    .withOfficerNumber(officerNumber)
    .withId(undefined);

  const officer = await models.officer.create(officerAttributes, {
    auditUser: "someone"
  });

  return new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withId(undefined)
    .withOfficerId(officer.id)
    .withRoleOnCase(role)
    .withCreatedAt(dateCreated);
};
