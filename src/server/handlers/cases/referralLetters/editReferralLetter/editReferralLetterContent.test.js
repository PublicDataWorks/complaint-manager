import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import models from "../../../../policeDataManager/models/index";
import httpMocks from "node-mocks-http";
import Case from "../../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../../sharedTestHelpers/caseStatus";
import editReferralLetterContent from "./editReferralLetterContent";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

describe("Edit referral letter addresses", () => {
  let response, next, statuses;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("with existing letter", () => {
    let referralLetter, existingCase;

    const newEditedLetterHtml = "<p>new letter content</p>";

    beforeEach(async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });
      await existingCase.update(
        {
          statusId: statuses.find(status => status.name === "Active").id
        },
        { auditUser: "test" }
      );
      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "user" }
      );
    });

    test("save edited letter html content", async () => {
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Letter in Progress"
          ).id
        },
        { auditUser: "test" }
      );

      const request = requestWithUpdatedLetterContent();

      await editReferralLetterContent(request, response, next);

      await referralLetter.reload();
      expect(referralLetter.editedLetterHtml).toEqual(newEditedLetterHtml);
    });

    test("throws exception when case status is invalid (prior to letter)", async () => {
      const request = requestWithUpdatedLetterContent();
      await editReferralLetterContent(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });

    test("throws exception when case status is invalid (after ready for review)", async () => {
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Forwarded to Agency"
          ).id
        },
        { auditUser: "test" }
      );

      const request = requestWithUpdatedLetterContent();
      await editReferralLetterContent(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
      );
    });

    test("throws exception when there is no referral letter with the case id", async () => {
      const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
      existingCase = await models.cases.create(caseAttributes, {
        auditUser: "test"
      });
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Letter in Progress"
          ).id
        },
        { auditUser: "test" }
      );

      const request = requestWithUpdatedLetterContent();
      await editReferralLetterContent(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.REFERRAL_LETTER_DOES_NOT_EXIST)
      );
    });

    const requestWithUpdatedLetterContent = () => {
      return httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer token"
        },
        params: { caseId: existingCase.id },
        body: { editedLetterHtml: newEditedLetterHtml },
        nickname: "nickname"
      });
    };
  });
});
