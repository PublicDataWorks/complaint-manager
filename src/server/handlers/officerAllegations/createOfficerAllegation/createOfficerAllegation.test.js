import models from "../../../policeDataManager/models";
import Allegation from "../../../../sharedTestHelpers/Allegation";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Officer from "../../../../sharedTestHelpers/Officer";
import * as httpMocks from "node-mocks-http";
import createOfficerAllegation from "./createOfficerAllegation";
import Boom from "boom";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  ALLEGATION_SEVERITY,
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("../../audits/auditDataAccess");

describe("createOfficerAllegation", () => {
  let newCase, allegation, response, next, ruleChapter, directive;

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    response = httpMocks.createResponse();
    next = jest.fn();

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    const officer = await models.officer.create(officerAttributes);

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .build();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withAccusedOfficers([caseOfficerAttributes])
      .build();

    newCase = await models.cases.create(caseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ]
    });

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .build();

    allegation = await models.allegation.create(allegationAttributes);

    ruleChapter = await models.ruleChapter.create(
      { name: "Don't crime" },
      { auditUser: "user" }
    );

    directive = await models.directive.create(
      { name: "seriously, don't crime" },
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it calls next with an error if details are missing", async () => {
    const caseOfficer = newCase.accusedOfficers[0];

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: null,
        severity: ALLEGATION_SEVERITY.LOW
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await createOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badImplementation(
        "notNull Violation: officer_allegation.details cannot be null"
      )
    );
  });

  test("it creates the officer allegation in the database", async () => {
    const caseOfficer = newCase.accusedOfficers[0];
    const allegationDetails = "test details";

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW,
        ruleChapterId: ruleChapter.id,
        directiveId: directive.id
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await createOfficerAllegation(request, response, next);

    const officerAllegation = await models.officer_allegation.findOne({
      where: { caseOfficerId: caseOfficer.id, allegationId: allegation.id }
    });

    expect(officerAllegation).toEqual(
      expect.objectContaining({
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW,
        ruleChapterId: ruleChapter.id,
        directiveId: directive.id
      })
    );
  });

  test("it should create a new rule chapter if ruleChapterName is passed and a new directive if directiveName is passed", async () => {
    const caseOfficer = newCase.accusedOfficers[0];
    const allegationDetails = "test details";

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW,
        ruleChapterName: "illegal things",
        directiveName: "NEW DIRECTIVE"
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    await createOfficerAllegation(request, response, next);

    const officerAllegation = await models.officer_allegation.findOne({
      where: { caseOfficerId: caseOfficer.id, allegationId: allegation.id },
      include: ["ruleChapter", "directive"]
    });

    expect(officerAllegation).toEqual(
      expect.objectContaining({
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW,
        ruleChapter: expect.objectContaining({ name: "illegal things" }),
        directive: expect.objectContaining({ name: "NEW DIRECTIVE" })
      })
    );
  });

  test("should return BAD REQUEST status if rule chapter does not exist", async () => {
    const caseOfficer = newCase.accusedOfficers[0];
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: "details",
        ruleChapterId: ruleChapter.id + 1,
        severity: ALLEGATION_SEVERITY.LOW
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    const next = jest.fn();
    await createOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_RULE_CHAPTER)
    );
  });

  test("should return BAD REQUEST status if directive does not exist", async () => {
    const caseOfficer = newCase.accusedOfficers[0];
    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: newCase.id,
        caseOfficerId: caseOfficer.id
      },
      body: {
        allegationId: allegation.id,
        details: "details",
        directiveId: directive.id + 1,
        severity: ALLEGATION_SEVERITY.LOW
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    const next = jest.fn();
    await createOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_DIRECTIVE)
    );
  });

  describe("auditing", () => {
    let request, response, next;

    beforeEach(() => {
      const caseOfficer = newCase.accusedOfficers[0];
      const allegationDetails = "test details";

      request = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: newCase.id,
          caseOfficerId: caseOfficer.id
        },
        body: {
          allegationId: allegation.id,
          details: allegationDetails,
          severity: ALLEGATION_SEVERITY.MEDIUM
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.EDIT_CASE
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    test("should audit case data access when officer allegation created", async () => {
      await createOfficerAllegation(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        newCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
