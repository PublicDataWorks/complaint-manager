import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  CIVILIAN_INITIATED,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION,
  CASE_STATUS
} from "../../../../../sharedUtilities/constants";
import getFinalPdfUrl from "./getFinalPdfUrl";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";
import Boom from "boom";

const httpMocks = require("node-mocks-http");

jest.mock("../../../../createConfiguredS3Instance");

describe("getFinalPdfUrl", () => {
  let request, response, next, existingCase, getSignedUrlMock;
  beforeEach(async () => {
    getSignedUrlMock = jest.fn(() => "url");
    createConfiguredS3Instance.mockImplementation(() => ({
      getSignedUrl: getSignedUrlMock
    }));

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(CIVILIAN_INITIATED);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "someone" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "someone" }
    );
    await existingCase.update(
      { status: CASE_STATUS.READY_FOR_REVIEW },
      { auditUser: "someone" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: existingCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("access to pdf letter is audited", async () => {
    await existingCase.update(
      { status: CASE_STATUS.FORWARDED_TO_AGENCY },
      { auditUser: "someone" }
    );
    await getFinalPdfUrl(request, response, next);

    const createdAudit = await models.action_audit.find();
    expect(createdAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(createdAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(createdAudit.user).toEqual("TEST_USER_NICKNAME");
    expect(createdAudit.caseId).toEqual(existingCase.id);
    expect(createdAudit.subject).toEqual(AUDIT_SUBJECT.REFERRAL_LETTER);
    expect(createdAudit.subjectDetails).toEqual([
      "Case Data",
      "Referral Letter Data"
    ]);
  });

  test("should retrieve download url for pdf", async () => {
    await existingCase.update(
      { status: CASE_STATUS.FORWARDED_TO_AGENCY },
      { auditUser: "someone" }
    );
    const getSignedUrlMock = jest.fn(() => "url");
    createConfiguredS3Instance.mockImplementation(() => ({
      getSignedUrl: getSignedUrlMock
    }));

    await getFinalPdfUrl(request, response, next);

    expect(getSignedUrlMock).toHaveBeenCalledWith(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: `${existingCase.id}/ReferralLetter_${existingCase.caseNumber}.pdf`,
      Expires: S3_URL_EXPIRATION
    });
    expect(response._getData()).toEqual("url");
  });

  test("returns 400 bad request if case is in status before forwarded to agency", async () => {
    await getFinalPdfUrl(request, response, next);
    expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
  });
});
