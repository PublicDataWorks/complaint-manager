import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
import addCaseOfficer from "./addCaseOfficer";
import * as httpMocks from "node-mocks-http";
import Officer from "../../../../client/testUtilities/Officer";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../requestTestHelpers";

describe("addCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should change the case status to active when any officer is added", async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus("Initial")
      .withIncidentLocation(undefined);

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id
      },
      body: {
        officerId: null,
        roleOnCase: ACCUSED,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfInterest = await models.cases.findById(createdCase.id);
    expect(caseOfInterest).toEqual(
      expect.objectContaining({
        status: "Active"
      })
    );
  });

  test("should create a case_officer record when adding known officer to a case", async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus("Initial")
      .withIncidentLocation(undefined);

    const officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });
    const createdOfficer = await models.officer.create(officerToCreate);

    const officerAttributes = {
      officerId: createdOfficer.id,
      roleOnCase: ACCUSED,
      notes: "these are notes"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id
      },
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: createdCase.id }
    });

    expect(caseOfficerCreated).toEqual(
      expect.objectContaining({
        officerId: createdOfficer.id,
        notes: officerAttributes.notes,
        roleOnCase: officerAttributes.roleOnCase
      })
    );
  });

  test("should create a case_officer record when adding unknown officer to a case", async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus("Initial")
      .withIncidentLocation(undefined);

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const officerAttributes = {
      officerId: null,
      roleOnCase: ACCUSED,
      notes: "these are notes"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id
      },
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: createdCase.id }
    });

    expect(caseOfficerCreated).toEqual(
      expect.objectContaining({
        officerId: null,
        notes: officerAttributes.notes,
        roleOnCase: officerAttributes.roleOnCase
      })
    );
  });

  test("should not change case officer snapshot if officer changes", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Brandon")
      .withId(undefined)
      .withOfficerNumber(200)
      .withHireDate("2018-01-12")
      .build();

    const officer = await models.officer.create(officerAttributes);

    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();

    const existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });

    const additionalOfficerAttributes = {
      officerId: officer.id,
      roleOnCase: ACCUSED,
      notes: "these are notes"
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: additionalOfficerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerId = response._getData().dataValues.accusedOfficers[0].id;

    await officer.update(
      { firstName: "Wilbert" },
      { auditUser: request.nickname }
    );

    const caseOfficer = await models.case_officer.findById(caseOfficerId);

    expect(caseOfficer.firstName).toEqual("Brandon");
  });
});
