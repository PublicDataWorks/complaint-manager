import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { generatePdf } from "./generatePdf";

describe("Generate referral letter pdf", () => {
  let existingCase, request, response, next, referralLetter;

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
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
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

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient("recipient address")
      .withSender("sender address")
      .withTranscribedBy("transcriber")
      .withIncludeRetaliationConcerns(true);

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test"
      }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns letter pdf blob", async () => {
    await generatePdf(request, response, next);
    const responseBody = response._getData();
    expect(responseBody).not.toBeNull();
    //TODO: expect specific data
  });
});
