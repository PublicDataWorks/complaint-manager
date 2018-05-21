import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
import addCaseOfficer from "./addCaseOfficer";
import * as httpMocks from "node-mocks-http";
import Officer from "../../../../client/testUtilities/Officer";

describe("addCaseOfficer", () => {
  afterEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.audit_log.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
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
        roleOnCase: "Accused",
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
      roleOnCase: "Accused",
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
      roleOnCase: "Accused",
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

  test("should track add officer in audit log", async () => {
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
      roleOnCase: "Accused",
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
    const auditLog = await models.audit_log.findAll({
      where: { caseId: createdCase.id }
    });
    expect(auditLog.length).toEqual(1);
    expect(auditLog[0].dataValues.action).toEqual("Officer Added as Accused");
  });
});
