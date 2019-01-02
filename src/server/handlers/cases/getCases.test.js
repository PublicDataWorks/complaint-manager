import app from "../../server";
import models from "../../models/index";
import moment from "moment/moment";
import Case from "../../../client/testUtilities/case";
import { mockCase } from './mock';
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import Officer from "../../../client/testUtilities/Officer";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import {
  ACCUSED,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  COMPLAINANT
} from "../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import { map, sortBy } from 'lodash';
const { INITIAL, ACTIVE } = CASE_STATUS;

describe("getCases", () => {
  const auditUser = "someone";
  let token;
  const include = [
    {
      model: models.civilian,
      as: "complainantCivilians",
      auditUser
    },
    {
      model: models.case_officer,
      as: "accusedOfficers",
      auditUser
    },
    {
      model: models.case_officer,
      as: "complainantOfficers",
      auditUser
    }
  ]

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
        include, auditUser
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
        })
    });
  });

  describe('should sort cases', () => {
    const p1 = {caseId: 1, lastName: "Grant"};
    const p2 = {caseId: 2, lastName: "Zeta"};
    const cases = [{
      id: 1,
      status: INITIAL,
      assignedTo: 'test1',
      firstContactDate: "2018-01-01",
      accusedOfficers: [{...p1, roleOnCase: ACCUSED}],
      complainantCivilians: [p1],
      complainantOfficers: [{...p1, roleOnCase: COMPLAINANT}]
    }, {
      id: 2,
      status: ACTIVE,
      assignedTo: 'test2',
      firstContactDate: "2019-01-01",
      accusedOfficers: [{...p2, roleOnCase: ACCUSED}],
      complainantCivilians: [p2],
      complainantOfficers: [{...p2, roleOnCase: COMPLAINANT}]
    }].map(mockCase);
    const casesReverse = cases.slice().reverse();

    beforeEach(async () => {
      await Promise.all(
        cases.map(Case => models.cases.create(Case, {include, auditUser}))
      );
    });

    test.each`
      sortBy                   | sortDirection | cases
      ${'id'}                  | ${'asc'}      | ${cases}
      ${'id'}                  | ${'desc'}     | ${casesReverse}
      ${'status'}              | ${'asc'}      | ${cases}
      ${'status'}              | ${'desc'}     | ${casesReverse}
      ${'assignedTo'}          | ${'asc'}      | ${cases}
      ${'assignedTo'}          | ${'desc'}     | ${casesReverse}
      ${'firstContactDate'}    | ${'asc'}      | ${cases}
      ${'firstContactDate'}    | ${'desc'}     | ${casesReverse}
      ${'accusedOfficer'}      | ${'asc'}      | ${cases}
      ${'accusedOfficer'}      | ${'desc'}     | ${casesReverse}
      ${'complainant'}         | ${'asc'}      | ${cases}
      ${'complainant'}         | ${'desc'}     | ${casesReverse}
    `('sorts by $sortBy with direction $sortDirection'
      , async ({sortBy, sortDirection, cases}) => {
        await request(app)
          .get("/api/cases")
          .query({sortBy, sortDirection})
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .then(resp => {
            expect(map(resp.body.cases, 'id'))
              .toEqual(map(cases, 'id'));
          });
      });
  });

  test('sorts case collections by createdAt', async () => {
    const Case = mockCase({
      id: 1,
      complainantCivilians: [
        {caseId: 1, createdAt: "2019-01-01"},
        {caseId: 1, createdAt: "2019-01-02"}
      ],
      complainantOfficers: [
        {caseId: 1, roleOnCase: COMPLAINANT, createdAt: "2019-01-02"},
        {caseId: 1, roleOnCase: COMPLAINANT, createdAt: "2019-01-01"}
      ],
      accusedOfficers: [
        {caseId: 1, roleOnCase: ACCUSED, createdAt: "2019-01-01"},
        {caseId: 1, roleOnCase: ACCUSED, createdAt: "2019-01-02"}
      ]});
    await models.cases.create(Case, {include, auditUser})
    await request(app)
      .get("/api/cases")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(resp => {
        ['complainantCivilians', 'complainantOfficers', 'accusedOfficers']
          .forEach(key => {
            const coll = resp.body.cases[0][key]
            expect(coll).toEqual(sortBy(coll, 'createdAt'))
          });
      });
  });

  describe('when sorting by complainant, sort by civilianComplainant first', () => {
    const cases = [{
      id: 1,
      complainantCivilians: [{caseId: 1, lastName: "A"}],
      complainantOfficers: [{caseId: 1, roleOnCase: COMPLAINANT, lastName: "Z"}]
    }, {
      id: 2,
      complainantCivilians: [{caseId: 2, lastName: "B"}]
    }].map(mockCase);

    beforeEach(async () => {
      await Promise.all(
        cases.map(Case => models.cases.create(Case, {include, auditUser}))
      );
    });

    test.each`
      sortDirection | cases
      ${'asc'}      | ${cases}
      ${'desc'}     | ${cases.slice().reverse()}
    `('sorts by $sortDirection', async ({sortDirection, cases}) => {
      await request(app)
        .get("/api/cases")
        .query({sortBy: 'complainant', sortDirection})
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then(resp => {
          expect(map(resp.body.cases, 'id'))
            .toEqual(map(cases, 'id'));
        });
    });
  });
});
