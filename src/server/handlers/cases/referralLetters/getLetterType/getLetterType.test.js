import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Case from "../../../../../client/testUtilities/case";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import getLetterType from "./getLetterType";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  LETTER_TYPE
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import httpMocks from "node-mocks-http";

describe("getLetterType", () => {
  let response, next, request, existingCase, referralLetter;

  afterEach(async () => {
    await cleanupDatabase();
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

  test("returns null if no referral letter", async () => {
    await getLetterType(request, response, next);
    const responseBody = response._getData();
    expect(responseBody.letterType).toEqual(null);
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
      await getLetterType(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.letterType).toEqual(LETTER_TYPE.GENERATED);
    });

    test("gets letter type edited when edited letter html is not null", async () => {
      await referralLetter.update(
        {
          editedLetterHtml: "<p>edited letter html</p>"
        },
        { auditUser: "test" }
      );

      await referralLetter.reload();

      await getLetterType(request, response, next);
      const responseBody = response._getData();
      expect(responseBody.letterType).toEqual(LETTER_TYPE.EDITED);
    });

    test("audits the data access", async () => {
      await getLetterType(request, response, next);

      const dataAccessAudit = await models.action_audit.findOne();
      expect(dataAccessAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
      expect(dataAccessAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
      expect(dataAccessAudit.user).toEqual("nickname");
      expect(dataAccessAudit.caseId).toEqual(existingCase.id);
      expect(dataAccessAudit.subject).toEqual(AUDIT_SUBJECT.LETTER_TYPE);
      expect(dataAccessAudit.subjectDetails).toEqual(["Letter Type"]);
    });
  });
});
