import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import models from "../../../../models/index";
import editReferralLetterAddresses from "./editReferralLetterAddresses";
import httpMocks from "node-mocks-http";
import Case from "../../../../../client/testUtilities/case";
import Boom from "boom";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";

describe("Edit referral letter addresses", () => {
  let response, next;
  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("with existing letter", () => {
    let referralLetter, existingCase;
    beforeEach(async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "user" }
      );
    });

    test("throws error if case is not in valid status for letter", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        body: {},
        nickname: "nickname"
      });

      await editReferralLetterAddresses(request, response, next);
      expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
    });

    test("update existing referral letter recipient, sender and transcribed by", async () => {
      await existingCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "test" }
      );
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
      const requestBody = {
        recipient: "some recipient",
        sender: "some sender",
        transcribedBy: "some transcriber"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        body: requestBody,
        nickname: "nickname"
      });

      await editReferralLetterAddresses(request, response, next);

      await referralLetter.reload();

      expect(referralLetter.recipient).toEqual(requestBody.recipient);
      expect(referralLetter.sender).toEqual(requestBody.sender);
      expect(referralLetter.transcribedBy).toEqual(requestBody.transcribedBy);
    });
  });
});
