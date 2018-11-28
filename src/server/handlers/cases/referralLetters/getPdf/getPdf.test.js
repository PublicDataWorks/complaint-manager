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
import getPdf from "./getPdf";
import Boom from "boom";
import getLetterPreview from "../getLetterPreview/getLetterPreview";

jest.mock(
  "../sharedReferralLetterUtilities/generateLetterPdfBuffer",
  () => caseId => `pdf for case ${caseId}`
);

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
    test("audits the data access", async () => {
      await getPdf(request, response, next);

      const dataAccessAudit = await models.action_audit.find();
      expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
      expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
      expect(dataAccessAudit.user).toEqual("bobjo");
      expect(dataAccessAudit.caseId).toEqual(existingCase.id);
      expect(dataAccessAudit.subject).toEqual(AUDIT_SUBJECT.REFERRAL_LETTER);
      expect(dataAccessAudit.subjectDetails).toEqual([
        "Case Data",
        "Referral Letter Data"
      ]);
    });

    test("returns results full generated pdf response", async () => {
      await getPdf(request, response, next);
      expect(response._getData()).toEqual(`pdf for case ${existingCase.id}`);
    });
  });

  describe("case in invalid status", () => {
    test("expects boom to have error when case is in invalid status", async () => {
      await getPdf(request, response, next);
      expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
    });
  });
});
