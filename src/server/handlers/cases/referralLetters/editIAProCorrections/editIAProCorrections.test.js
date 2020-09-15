import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import models from "../../../../complaintManager/models/index";
import ReferralLetterIAProCorrection from "../../../../testHelpers/ReferralLetterIAProCorrection";
import Case from "../../../../../sharedTestHelpers/case";
import httpMocks from "node-mocks-http";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import editIAProCorrections from "./editIAProCorrections";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

describe("editIAProCorrections", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  let existingCase, referralLetter, response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );
  });

  test("invalid case status returns 400", async () => {
    const requestBody = {
      referralLetterIaproCorrections: [{ id: "123", details: "new details" }]
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

    await editIAProCorrections(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
    );
  });

  describe("letter in progress", () => {
    beforeEach(async () => {
      await existingCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "test" }
      );
    });
    test("saves new iapro correction", async () => {
      const requestBody = {
        referralLetterIaproCorrections: [
          { tempId: "abcd1234", details: "some stuff" },
          { tempId: "poiu8765", details: "some more stuff" }
        ]
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
      await editIAProCorrections(request, response, next);

      expect(response.statusCode).toEqual(200);
      const createdIAProCorrections = await models.referral_letter_iapro_correction.findAll(
        { where: { referralLetterId: referralLetter.id } }
      );
      expect(createdIAProCorrections.length).toEqual(2);
      expect(createdIAProCorrections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            referralLetterId: referralLetter.id,
            details: "some stuff"
          }),
          expect.objectContaining({
            referralLetterId: referralLetter.id,
            details: "some more stuff"
          })
        ])
      );
    });

    test("doesn't add empty iapro corrections", async () => {
      const requestBody = {
        referralLetterIaproCorrections: [
          { tempId: "abcd1234", details: "" },
          { tempId: "poiu8765" }
        ]
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
      await editIAProCorrections(request, response, next);
      expect(response.statusCode).toEqual(200);
      const foundIAProCorrections = await models.referral_letter_iapro_correction.findAll();
      expect(foundIAProCorrections.length).toEqual(0);
    });

    describe("existing iapro correction", () => {
      let iaproCorrection;
      beforeEach(async () => {
        const iaproCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
          .defaultReferralLetterIAProCorrection()
          .withId(undefined)
          .withReferralLetterId(referralLetter.id)
          .withDetails("Stuff was wrong!!!");
        iaproCorrection = await models.referral_letter_iapro_correction.create(
          iaproCorrectionAttributes,
          { auditUser: "test" }
        );
      });
      test("updates existing iapro correction", async () => {
        const newDetails = "some new details";
        const requestBody = {
          referralLetterIaproCorrections: [
            { id: iaproCorrection.id, details: newDetails }
          ]
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
        await editIAProCorrections(request, response, next);
        expect(response.statusCode).toEqual(200);
        await iaproCorrection.reload();
        expect(iaproCorrection.details).toEqual(newDetails);
      });

      test("deletes existing iapro correction", async () => {
        const requestBody = { referralLetterIaproCorrections: [] };
        const request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer token"
          },
          params: { caseId: existingCase.id },
          body: requestBody,
          nickname: "nickname"
        });
        await editIAProCorrections(request, response, next);
        expect(response.statusCode).toEqual(200);
        const foundIAProCorrections = await models.referral_letter_iapro_correction.findAll();
        expect(foundIAProCorrections.length).toEqual(0);
      });
      test("deletes empty updates to existing iapro corrections", async () => {
        const requestBody = {
          referralLetterIaproCorrections: [
            { id: iaproCorrection.id, details: "" }
          ]
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
        await editIAProCorrections(request, response, next);
        const foundCorrections = await models.referral_letter_iapro_correction.findAll();
        expect(foundCorrections.length).toEqual(0);
      });
    });

    test("throws error when given non-existing iapro correction id", async () => {
      const requestBody = {
        referralLetterIaproCorrections: [{ id: "123", details: "new details" }]
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
      await editIAProCorrections(request, response, next);
      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_IAPRO_CORRECTION)
      );
    });
  });
});
