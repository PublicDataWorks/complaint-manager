import Inmate from "../../../sharedTestHelpers/Inmate";
import CaseInmate from "../../../sharedTestHelpers/CaseInmate";
import models from "../../policeDataManager/models/index";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import PersonType from "../../../sharedTestHelpers/PersonType";
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
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

jest.mock("../audits/auditDataAccess");

describe("removeCaseInmate", () => {
  let response, request, next, caseToCreate, inmateToCreate, existingCase;
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.personType.create(
      new PersonType.Builder()
        .defaultPersonType()
        .withKey("PERSON_IN_CUSTODY")
        .build()
    );
    next = jest.fn();
    response = httpMocks.createResponse();

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

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

    request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        caseInmateId: existingCase.witnessInmates[0].id
      },
      nickname: "someone",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });
  });

  test("should return 400 status if the case inmate does not exist", async () => {
    const invalidRequest = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id,
        caseInmateId: existingCase.witnessInmates[0].id + 7
      },
      nickname: "someone",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });
    await removeCaseInmate(invalidRequest, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.REMOVE_CASE_INMATE_ERROR)
    );
  });

  test("should delete an inmate from a case", async () => {
    await removeCaseInmate(request, response, next);
    const removedCaseInmate = await models.caseInmate.findByPk(
      existingCase.witnessInmates[0].id
    );

    expect(removedCaseInmate).toEqual(null);
  });

  describe("auditing", () => {
    test("should audit case details access when case inmate removed", async () => {
      await removeCaseInmate(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
