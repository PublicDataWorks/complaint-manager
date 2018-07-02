import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import app from "../../../server";
import request from "supertest";

describe("GET /cases/:caseId/cases-officers/:caseOfficerId", () => {
  let token;

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return back a case officer", async () => {
    token = buildTokenWithPermissions("", "TEST_NICKNAME");

    const existingSupervisor = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(200)
      .withFirstName("Miss")
      .withMiddleName("S")
      .withLastName("Supervisor")
      .build();
    const createdSupervisor = await models.officer.create(existingSupervisor);

    const existingOfficer = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .withOfficerNumber(201)
      .withFirstName("Mister")
      .withMiddleName("M")
      .withLastName("Officer")
      .build();
    const createdOfficer = await models.officer.create(existingOfficer);

    const existingCaseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerAttributes(createdOfficer.dataValues)
      .withSupervisor(createdSupervisor.dataValues)
      .build();

    const existingCase = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withAccusedOfficers([existingCaseOfficer])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(existingCase, {
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ],
      auditUser: "someone",
      returning: true
    });

    await request(app)
      .get(
        `/api/cases/${createdCase.id}/cases-officers/${
          createdCase.accusedOfficers[0].id
        }`
      )
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .expect(200)
      .then(response =>
        expect(response.body).toEqual(
          expect.objectContaining({
            id: createdCase.accusedOfficers[0].id,
            officerId: createdOfficer.id,
            firstName: createdOfficer.firstName,
            middleName: createdOfficer.middleName,
            lastName: createdOfficer.lastName,
            supervisorFirstName: createdSupervisor.firstName,
            supervisorMiddleName: createdSupervisor.middleName,
            supervisorLastName: createdSupervisor.lastName
          })
        )
      );
  });
});
