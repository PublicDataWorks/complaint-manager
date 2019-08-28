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
  CASE_STATUS,
  WITNESS,
  EMPLOYEE_TYPE
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  expectedCaseAuditDetails,
  expectedFormattedCaseAuditDetails
} from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../audits/auditDataAccess");

describe("addCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  let existingCase, response, next;

  beforeEach(async () => {
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withIncidentLocation(undefined);

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
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
        caseEmployeeType: EMPLOYEE_TYPE.OFFICER,
        roleOnCase: ACCUSED,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await addCaseOfficer(request, response, next);

    const caseOfInterest = await models.cases.findByPk(existingCase.id);
    expect(caseOfInterest).toEqual(
      expect.objectContaining({
        status: CASE_STATUS.ACTIVE
      })
    );
  });

  test("should create a case_officer record when adding known ACCUSED officer to a case", async () => {
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

    await addCaseOfficer(request, response, next);

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseOfficerCreated).toEqual(
      expect.objectContaining({
        officerId: createdOfficer.id,
        notes: officerAttributes.notes,
        roleOnCase: officerAttributes.roleOnCase,
        isAnonymous: false
      })
    );
  });

  test("should create a case_officer record when adding known ACCUSED officer to a case, but should not be anonymous even if param is sent", async () => {
    const officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const createdOfficer = await models.officer.create(officerToCreate);

    const officerAttributes = {
      officerId: createdOfficer.id,
      roleOnCase: ACCUSED,
      notes: "these are notes",
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
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    await addCaseOfficer(request, response, next);

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseOfficerCreated).toEqual(
      expect.objectContaining({
        officerId: createdOfficer.id,
        notes: officerAttributes.notes,
        roleOnCase: officerAttributes.roleOnCase,
        isAnonymous: false
      })
    );
  });

  test("should create a case_officer record when adding known WITNESS officer to a case", async () => {
    const officerToCreate = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const createdOfficer = await models.officer.create(officerToCreate);

    const officerAttributes = {
      officerId: createdOfficer.id,
      roleOnCase: WITNESS,
      notes: "these are notes",
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
      body: officerAttributes,
      nickname: "TEST_USER_NICKNAME"
    });

    await addCaseOfficer(request, response, next);

    const caseOfficerCreated = await models.case_officer.findOne({
      where: { caseId: existingCase.id }
    });

    expect(caseOfficerCreated).toEqual(
      expect.objectContaining({
        officerId: createdOfficer.id,
        notes: officerAttributes.notes,
        roleOnCase: officerAttributes.roleOnCase,
        isAnonymous: officerAttributes.isAnonymous
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

    await addCaseOfficer(request, response, next);

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

    await addCaseOfficer(request, response, next);

    const caseOfficerId = response._getData().accusedOfficers[0].id;

    await officer.update(
      { firstName: "Wilbert" },
      { auditUser: request.nickname }
    );

    const caseOfficer = await models.case_officer.findByPk(caseOfficerId);

    expect(caseOfficer.firstName).toEqual("Brandon");
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
        caseEmployeeType: EMPLOYEE_TYPE.OFFICER,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await addCaseOfficer(request, response, next);

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

    await addCaseOfficer(request, response, next);

    const caseOfficerId = response._getData().accusedOfficers[0].id;

    const letterOfficer = await models.letter_officer.findOne({
      where: { caseOfficerId: caseOfficerId }
    });

    expect(letterOfficer).toBeNull();
  });

  test("Should return an officer with employee type civilian within NOPD", async () => {
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
        caseEmployeeType: EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD,
        notes: "these are notes"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await addCaseOfficer(request, response, next);

    const caseOfficerEmployeeType = response._getData().accusedOfficers[0]
      .caseEmployeeType;

    expect(caseOfficerEmployeeType).toEqual(EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD);
  });

  describe("auditing", () => {
    let request;
    beforeEach(async () => {
      const officerToCreate = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined);

      const createdOfficer = await models.officer.create(officerToCreate);

      const officerAttributes = {
        officerId: createdOfficer.id,
        roleOnCase: ACCUSED,
        notes: "these are notes"
      };

      request = httpMocks.createRequest({
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
    });
    describe("newAuditFeature disabled", () => {
      test("should audit case details access", async () => {
        request.fflip = mockFflipObject({ newAuditFeature: false });

        await addCaseOfficer(request, response, next);

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: existingCase.id }
        });

        expect(actionAudit).toEqual(
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            caseId: existingCase.id,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            auditDetails: expectedFormattedCaseAuditDetails
          })
        );
      });
    });

    describe("newAuditFeature enabled", () => {
      test("should audit case details access", async () => {
        request.fflip = mockFflipObject({ newAuditFeature: true });

        await addCaseOfficer(request, response, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          expectedCaseAuditDetails,
          expect.anything()
        );
      });
    });
  });
});
