import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import generatePdf from "./generatePdf";
import Boom from "boom";

jest.mock(
  "../sharedReferralLetter/generateFullReferralLetterPdf",
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

  test("returns results full generated pdf response", async () => {
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );
    await generatePdf(request, response, next);
    expect(response._getData()).toEqual(`pdf for case ${existingCase.id}`);
  });

  test("expects boom to have error when case is in invalid status", async () => {
    await generatePdf(request, response, next);
    expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
  });
});
