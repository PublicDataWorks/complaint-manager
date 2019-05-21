import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import Case from "../../../client/testUtilities/case";
import models from "../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS
} from "../../../sharedUtilities/constants";
import createCaseNote from "./createCaseNote";
import * as httpMocks from "node-mocks-http";
import moment from "moment";
import auditDataAccess from "../auditDataAccess";
import mockFflipObject from "../../testHelpers/mockFflipObject";

//mocked implementation in "/handlers/__mocks__/getQueryAuditAccessDetails"
jest.mock("../getQueryAuditAccessDetails");

jest.mock("../auditDataAccess");

describe("createCaseNote", function() {
  let createdCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { action: "some action", actionTakenAt: moment() },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("newAuditFeature is disabled", () => {
    test("should audit case note accessed", async () => {
      request.fflip = mockFflipObject({ newAuditFeature: false });
      await createCaseNote(request, response, next);

      const actionAudit = await models.action_audit.findAll({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_NOTES,
            caseId: createdCase.id
          })
        ])
      );
    });

    test("should audit case details accessed", async () => {
      request.fflip = mockFflipObject({ newAuditFeature: false });
      await createCaseNote(request, response, next);

      const actionAudit = await models.action_audit.findAll({
        where: { caseId: createdCase.id }
      });

      expect(actionAudit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "TEST_USER_NICKNAME",
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            caseId: createdCase.id,
            auditDetails: { ["Mock Association"]: ["Mock Details"] }
          })
        ])
      );
    });
  });

  describe("newAuditFeature is enabled", () => {
    test("should audit case note accessed", async () => {
      request.fflip = mockFflipObject({ newAuditFeature: true });

      await createCaseNote(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        AUDIT_SUBJECT.CASE_NOTES,
        {
          caseNote: {
            attributes: ["mockDetails"],
            model: models.case_note.name
          }
        },
        expect.anything()
      );
    });
    test("should audit case details accessed", async () => {
      request.fflip = mockFflipObject({ newAuditFeature: true });

      await createCaseNote(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        {
          mockAssociation: {
            attributes: ["mockDetails"],
            model: "mockModelName"
          }
        },
        expect.anything()
      );
    });
  });
});
