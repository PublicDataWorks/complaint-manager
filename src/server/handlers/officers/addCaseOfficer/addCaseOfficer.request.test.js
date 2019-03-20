import request from "supertest";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models/index";
import Case from "../../../../client/testUtilities/case";
import app from "../../../server";
import { ACCUSED, CASE_STATUS } from "../../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";

jest.mock("../../cases/export/jobQueue");

describe("POST /cases/:caseId/cases_officers", () => {
  let token;
  beforeAll(() => {
    token = buildTokenWithPermissions("", "TEST_NICKNAME");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should add a known officer to a case", async () => {
    let caseToCreate, officerToCreate, seededCase, seededOfficer;
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    seededOfficer = await models.officer.create(officerToCreate);
    seededCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const officerNotes = "some notes";
    const officerRole = ACCUSED;

    const responsePromise = request(app)
      .post(`/api/cases/${seededCase.id}/cases-officers`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        officerId: seededOfficer.id,
        notes: officerNotes,
        roleOnCase: officerRole
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            notes: officerNotes,
            roleOnCase: officerRole,
            firstName: seededOfficer.firstName,
            middleName: seededOfficer.middleName,
            lastName: seededOfficer.lastName,
            fullName: "Ugochi Grant Smith",
            supervisorFirstName: null,
            supervisorMiddleName: null,
            supervisorLastName: null,
            supervisorFullName: "",
            supervisorWindowsUsername: null,
            supervisorOfficerNumber: null
          })
        ])
      })
    );
  });

  test("should add officer that has supervisor to a case", async () => {
    let caseToCreate,
      supervisorToCreate,
      officerToCreate,
      seededCase,
      seededSupervisor,
      seededOfficer;
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();

    supervisorToCreate = new Officer.Builder()
      .defaultOfficer()
      .withOfficerNumber(123)
      .withFirstName("Garret")
      .withMiddleName("Bobby")
      .withLastName("Ferguson")
      .withWindowsUsername(12345)
      .withId(undefined)
      .build();
    seededSupervisor = await models.officer.create(supervisorToCreate);

    officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withOfficerNumber(132)
      .withId(undefined)
      .withSupervisor(seededSupervisor)
      .build();
    seededOfficer = await models.officer.create(officerToCreate);

    seededCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const officerNotes = "some notes";
    const officerRole = ACCUSED;

    const responsePromise = request(app)
      .post(`/api/cases/${seededCase.id}/cases-officers`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        officerId: seededOfficer.id,
        notes: officerNotes,
        roleOnCase: officerRole
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE,
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            notes: officerNotes,
            roleOnCase: officerRole,
            firstName: seededOfficer.firstName,
            middleName: seededOfficer.middleName,
            lastName: seededOfficer.lastName,
            fullName: "Ugochi Grant Smith",
            supervisorFirstName: seededSupervisor.firstName,
            supervisorMiddleName: seededSupervisor.middleName,
            supervisorLastName: seededSupervisor.lastName,
            supervisorFullName: "Garret Bobby Ferguson",
            supervisorWindowsUsername: seededSupervisor.windowsUsername,
            supervisorOfficerNumber: seededSupervisor.officerNumber
          })
        ])
      })
    );
  });

  test("should add an unknown officer to a case", async () => {
    let caseToCreate, officerToCreate, seededCase;
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();

    await models.officer.create(officerToCreate);
    seededCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const officerNotes = "some notes for an unknown officer";
    const responsePromise = request(app)
      .post(`/api/cases/${seededCase.id}/cases-officers/`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ officerId: null, notes: officerNotes, roleOnCase: ACCUSED });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        accusedOfficers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            notes: officerNotes,
            fullName: "Unknown Officer"
          })
        ])
      })
    );
  });
});
