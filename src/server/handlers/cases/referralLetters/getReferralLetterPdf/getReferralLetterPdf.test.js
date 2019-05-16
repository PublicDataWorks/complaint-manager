import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS
} from "../../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import getReferralLetterPdf from "./getReferralLetterPdf";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import mockFflipObject from "../../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../../auditDataAccess";

jest.mock(
  "./generateReferralLetterPdfBuffer",
  () => (caseId, includeSignature, transaction, auditDetails) => {
    auditDetails.mockAssociation = {
      attributes: ["mockDetails"],
      model: "mockModelName"
    };
    return `pdf for case ${caseId}`;
  }
);
jest.mock("../../../auditDataAccess");

describe("Generate referral letter pdf", () => {
  let existingCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25");
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "bobjo"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  describe("case in valid status", async () => {
    beforeEach(async () => {
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
    });

    test("returns results full generated pdf response", async () => {
      await getReferralLetterPdf(request, response, next);
      expect(response._getData()).toEqual(`pdf for case ${existingCase.id}`);
    });

    describe("newAuditFeature Disabled", () => {
      test("audits the data access", async () => {
        request.fflip = mockFflipObject({
          newAuditFeature: false
        });
        await getReferralLetterPdf(request, response, next);

        const dataAccessAudit = await models.action_audit.findOne();
        expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
        expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
        expect(dataAccessAudit.user).toEqual("bobjo");
        expect(dataAccessAudit.caseId).toEqual(existingCase.id);
        expect(dataAccessAudit.subject).toEqual(
          AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF
        );
        expect(dataAccessAudit.auditDetails).toEqual({
          "Mock Association": ["Mock Details"]
        });
      });
    });

    describe("newAuditFeature enabled", () => {
      test("audits the data access", async () => {
        request.fflip = mockFflipObject({
          newAuditFeature: true
        });
        await getReferralLetterPdf(request, response, next);

        const expectedAuditDetails = {
          mockAssociation: {
            attributes: ["mockDetails"],
            model: "mockModelName"
          }
        };

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF,
          expectedAuditDetails,
          expect.anything()
        );
      });
    });
  });

  describe("case in invalid status", () => {
    test("expects boom to have error when case is in invalid status", async () => {
      await getReferralLetterPdf(request, response, next);
      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });
  });
});
