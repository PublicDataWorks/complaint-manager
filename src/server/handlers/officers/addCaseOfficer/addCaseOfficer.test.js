import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
import addCaseOfficer from "./addCaseOfficer";
import * as httpMocks from "node-mocks-http";
import Officer from "../../../../client/testUtilities/Officer";
import {
  ACCUSED,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";

describe("addCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  let existingCase;

  beforeEach(async () => {
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withIncidentLocation(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });
  });

  test("should change the case status to active when any officer is added", async () => {
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
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

    const caseOfInterest = await models.cases.findByPk(existingCase.id);
    expect(caseOfInterest).toEqual(
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE
      })
    );
  });

  test("should create a case_officer record when adding known officer to a case", async () => {
    const officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

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
        caseId: existingCase.id
      },
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: existingCase.id }
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
        caseId: existingCase.id
      },
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: existingCase.id }
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

    const caseOfficerId = response._getData().accusedOfficers[0].id;

    await officer.update(
      { firstName: "Wilbert" },
      { auditUser: request.nickname }
    );

    const caseOfficer = await models.case_officer.findByPk(caseOfficerId);

    expect(caseOfficer.firstName).toEqual("Brandon");
  });

  test("should audit case details access", async () => {
    const officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

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
        caseId: existingCase.id
      },
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "TEST_USER_NICKNAME",
        caseId: existingCase.id,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS
      })
    );
  });

  test("should create letter officer if letter exists", async () => {
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "someone" }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);

    await models.referral_letter.create(referralLetterAttributes, {
      auditUser: "someone"
    });

    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "someone" }
    );

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Brandon")
      .withId(undefined)
      .withOfficerNumber(200)
      .withHireDate("2018-01-12")
      .build();

    const officer = await models.officer.create(officerAttributes);

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: {
        officerId: officer.id,
        roleOnCase: ACCUSED,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerId = response._getData().accusedOfficers[0].id;

    const letterOfficer = await models.letter_officer.findOne({
      where: { caseOfficerId: caseOfficerId }
    });

    expect(letterOfficer).toBeTruthy();
  });

  test("doesn't create letter officer when referral letter does not exist", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Brandon")
      .withId(undefined)
      .withOfficerNumber(200)
      .withHireDate("2018-01-12")
      .build();

    const officer = await models.officer.create(officerAttributes);

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      body: {
        officerId: officer.id,
        roleOnCase: ACCUSED,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();

    await addCaseOfficer(request, response, jest.fn());

    const caseOfficerId = response._getData().accusedOfficers[0].id;

    const letterOfficer = await models.letter_officer.findOne({
      where: { caseOfficerId: caseOfficerId }
    });

    expect(letterOfficer).toBeNull();
  });
});
