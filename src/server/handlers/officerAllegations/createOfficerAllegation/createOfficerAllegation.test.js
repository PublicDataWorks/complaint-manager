import models from "../../../models";
import Allegation from "../../../../client/testUtilities/Allegation";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Case from "../../../../client/testUtilities/case";
import Officer from "../../../../client/testUtilities/Officer";
import * as httpMocks from "node-mocks-http";
import createOfficerAllegation from "./createOfficerAllegation";
import Boom from "boom";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  ALLEGATION_SEVERITY,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../auditDataAccess";
import {
  expectedCaseAuditDetails,
  expectedFormattedCaseAuditDetails
} from "../../../testHelpers/expectedAuditDetails";

jest.mock("../../auditDataAccess");

describe("createOfficerAllegation", () => {
  let newCase, allegation, response, next;

  beforeEach(async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    response = httpMocks.createResponse();
    next = jest.fn();
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
  });

  afterEach(async () => {
    await cleanupDatabase();
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
      nickname: "TEST_USER_NICKNAME"
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
        severity: ALLEGATION_SEVERITY.LOW
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await createOfficerAllegation(request, response, next);

    const officerAllegation = await models.officer_allegation.findOne({
      where: { caseOfficerId: caseOfficer.id, allegationId: allegation.id }
    });

    expect(officerAllegation).toEqual(
      expect.objectContaining({
        details: allegationDetails,
        severity: ALLEGATION_SEVERITY.LOW
      })
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
        nickname: "TEST_USER_NICKNAME"
      });

      response = httpMocks.createResponse();
      next = jest.fn();
    });

    describe("newAuditFeature disabled", () => {
      test("should audit case data access when officer allegation created", async () => {
        request.fflip = mockFflipObject({ newAuditFeature: false });

        await createOfficerAllegation(request, response, next);

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: newCase.id }
        });

        expect(actionAudit).toEqual(
          expect.objectContaining({
            caseId: newCase.id,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: "TEST_USER_NICKNAME",
            auditDetails: expectedFormattedCaseAuditDetails
          })
        );
      });
    });

    describe("newAuditFeature enabled", () => {
      test("should audit case data access when officer allegation created", async () => {
        request.fflip = mockFflipObject({ newAuditFeature: true });

        await createOfficerAllegation(request, response, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          newCase.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          expectedCaseAuditDetails,
          expect.anything()
        );
      });
    });
  });
});
