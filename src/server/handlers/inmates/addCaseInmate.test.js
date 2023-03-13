import Case from "../../../sharedTestHelpers/case";
import models from "../../policeDataManager/models/index";
import * as httpMocks from "node-mocks-http";
import Boom from "boom";
import Inmate from "../../../sharedTestHelpers/Inmate";
import {
  COMPLAINANT,
  USER_PERMISSIONS,
  WITNESS
} from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";
import addCaseInmate from "./addCaseInmate";
import {
  BAD_REQUEST_ERRORS,
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

jest.mock("../audits/auditDataAccess");

describe("addCaseInmate", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let existingCase, response, next, statuses;

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();

    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should change the case status to active when any inmate is added", async () => {
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: {
        inmateId: null,
        roleOnCase: COMPLAINANT,
        isAnonymous: true
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);

    const caseOfInterest = await models.cases.findByPk(existingCase.id);
    expect(caseOfInterest).toEqual(
      expect.objectContaining({
        statusId: statuses.find(status => status.name === "Active").id
      })
    );
  });

  test("should create a case inmate record when adding known COMPLAINANT inmate to a case", async () => {
    const inmateToCreate = new Inmate.Builder().defaultInmate().build();

    const createdInmate = await models.inmate.create(inmateToCreate);

    const inmateAttributes = {
      inmateId: createdInmate.inmateId,
      roleOnCase: COMPLAINANT
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);

    const caseInmateCreated = await models.caseInmate.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseInmateCreated).toEqual(
      expect.objectContaining({
        inmateId: createdInmate.inmateId,
        roleOnCase: inmateAttributes.roleOnCase,
        isAnonymous: false
      })
    );
  });

  test("should create a case inmate record when adding known WITNESS inmate to a case", async () => {
    const inmateToCreate = new Inmate.Builder().defaultInmate().build();

    const createdInmate = await models.inmate.create(inmateToCreate);

    const inmateAttributes = {
      inmateId: createdInmate.inmateId,
      roleOnCase: WITNESS,
      isAnonymous: true
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);

    const caseInmateCreated = await models.caseInmate.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseInmateCreated).toEqual(
      expect.objectContaining({
        inmateId: createdInmate.inmateId,
        roleOnCase: inmateAttributes.roleOnCase,
        isAnonymous: inmateAttributes.isAnonymous
      })
    );
  });

  test("should create a case inmate record when adding unknown inmate to a case", async () => {
    const inmateAttributes = {
      inmateId: null,
      roleOnCase: COMPLAINANT,
      isAnonymous: true
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);

    const caseInmateCreated = await models.caseInmate.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseInmateCreated).toEqual(
      expect.objectContaining({
        inmateId: null,
        roleOnCase: inmateAttributes.roleOnCase
      })
    );
  });

  test("should create a case inmate record when manually adding inmate to a case", async () => {
    const inmateAttributes = {
      roleOnCase: COMPLAINANT,
      firstName: "Billy"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);

    const caseInmateCreated = await models.caseInmate.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseInmateCreated).toEqual(
      expect.objectContaining({
        inmateId: null,
        roleOnCase: inmateAttributes.roleOnCase,
        firstName: "Billy"
      })
    );
  });

  test("should throw a 404 if the given case does not exist", async () => {
    const inmateAttributes = {
      roleOnCase: COMPLAINANT,
      firstName: "Billy"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id + 1
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND)
    );
  });

  test("should throw a 400 if inmate is not anonymous AND inmateId is set AND specified inmate does not exist", async () => {
    const inmateAttributes = {
      roleOnCase: COMPLAINANT,
      inmateId: "123"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: inmateAttributes,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await addCaseInmate(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_PERSON_IN_CUSTODY)
    );
  });
});
