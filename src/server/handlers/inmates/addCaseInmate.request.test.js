import request from "supertest";
import Inmate from "../../../sharedTestHelpers/Inmate";
import models from "../../policeDataManager/models/index";
import Case from "../../../sharedTestHelpers/case";
import app from "../../server";
import { COMPLAINANT } from "../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";

jest.mock(
  "../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("POST /cases/:caseId/inmates", () => {
  let token;
  beforeAll(() => {
    token = buildTokenWithPermissions("case:edit", "TEST_NICKNAME");
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should add a known inmate to a case", async () => {
    let caseToCreate, inmateToCreate, seededCase, seededInmate;
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    inmateToCreate = new Inmate.Builder().defaultInmate().build();
    seededInmate = await models.inmate.create(inmateToCreate);
    seededCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const inmateRole = COMPLAINANT;

    const responsePromise = request(app)
      .post(`/api/cases/${seededCase.id}/inmates`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        inmateId: seededInmate.inmateId,
        roleOnCase: inmateRole
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        id: expect.anything(),
        inmateId: seededInmate.inmateId,
        roleOnCase: COMPLAINANT
      })
    );
  });

  test("should add an unknown inmate to a case", async () => {
    let caseToCreate, inmateToCreate, seededCase;
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    inmateToCreate = new Inmate.Builder().defaultInmate().build();

    await models.inmate.create(inmateToCreate);
    seededCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const responsePromise = request(app)
      .post(`/api/cases/${seededCase.id}/inmates/`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ inmateId: null, roleOnCase: COMPLAINANT, isAnonymous: true });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        id: expect.anything(),
        roleOnCase: COMPLAINANT
      })
    );
  });
});
