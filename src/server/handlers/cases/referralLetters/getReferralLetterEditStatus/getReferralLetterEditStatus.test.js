import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../sharedTestHelpers/case";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import getReferralLetterEditStatus from "./getReferralLetterEditStatus";
import {
  AUDIT_SUBJECT,
  EDIT_STATUS,
  MANAGER_TYPE
} from "../../../../../sharedUtilities/constants";
import models from "../../../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import auditDataAccess from "../../../audits/auditDataAccess";

jest.mock("../../../audits/auditDataAccess");

describe("getReferralLetterEditStatus", () => {
  let response, next, request, existingCase, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);

    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: "nickname"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns edit status is null if no referral letter", async () => {
    await getReferralLetterEditStatus(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.editStatus).toEqual(null);
  });

  describe("there is a referral letter", () => {
    beforeEach(async () => {
      const letterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withEditedLetterHtml(null);

      referralLetter = await models.referral_letter.create(letterAttributes, {
        auditUser: "test"
      });
    });

    test("gets letter type generated when edited letter html is null", async () => {
      await getReferralLetterEditStatus(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.editStatus).toEqual(EDIT_STATUS.GENERATED);
    });

    test("gets letter type edited when edited letter html is not null", async () => {
      await referralLetter.update(
        {
          editedLetterHtml: "<p>edited letter html</p>"
        },
        { auditUser: "test" }
      );

      await referralLetter.reload();

      await getReferralLetterEditStatus(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.editStatus).toEqual(EDIT_STATUS.EDITED);
    });

    describe("auditing", () => {
      test("audits the data access", async () => {
        await getReferralLetterEditStatus(request, response, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
          {
            referralLetter: {
              attributes: expect.arrayContaining(["editStatus"]),
              model: models.referral_letter.name
            }
          },
          expect.anything()
        );
      });
    });
  });
});
