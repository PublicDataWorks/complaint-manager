import request from "supertest";
import Inmate from "../../../sharedTestHelpers/Inmate";
import CaseInmate from "../../../sharedTestHelpers/CaseInmate";
import models from "../../policeDataManager/models/index";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import app from "../../server";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import removeCaseInmate from "./removeCaseInmate";
import httpMocks from "node-mocks-http";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  USER_PERMISSIONS,
  WITNESS
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";

jest.mock("../audits/auditDataAccess");

describe("removeCaseInmate", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    let next = jest.fn();
    let response = httpMocks.createResponse();
  });

  test("should delete an inmate from a case", async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    let caseToCreate, inmateToCreate, existingCase, existingCaseInmate;
    const personInCustody = await models.inmate.create(
      new Inmate.Builder().defaultInmate(),
      { auditUser: "user" }
    );
    inmateToCreate = new CaseInmate.Builder()
      .defaultCaseInmate()
      .withInmateId(personInCustody.id)
      .withRoleOnCase(WITNESS)
      .withId(undefined)
      .build();
    caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withWitnessInmates([inmateToCreate])
      .build();

    existingCase = await models.cases.create(caseToCreate, {
      include: {
        model: models.caseInmate,
        as: "witnessInmates",
        auditUser: "someone"
      },
      auditUser: "someone"
    });
    existingCaseInmate = await models.caseInmate.create(inmateToCreate);

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        caseInmateId: existingCaseInmate.id
      },
      nickname: "someone",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await removeCaseInmate(request, response, next);
    const removedCaseInmate = await models.caseInmate.findByPk(
      existingCaseInmate.id
    );

    expect(removedCaseInmate).toEqual(null);
  });
});
