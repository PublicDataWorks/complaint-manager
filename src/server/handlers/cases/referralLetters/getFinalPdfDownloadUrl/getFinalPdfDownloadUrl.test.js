import Case from "../../../../../client/testUtilities/case";
import models from "../../../../models";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../../sharedUtilities/constants";
import getFinalPdfDownloadUrl from "./getFinalPdfDownloadUrl";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";
import Boom from "boom";
import Civilian from "../../../../../client/testUtilities/civilian";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import Officer from "../../../../../client/testUtilities/Officer";
import ReferralLetter from "../../../../../client/testUtilities/ReferralLetter";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

const httpMocks = require("node-mocks-http");

jest.mock("../../../../createConfiguredS3Instance");

describe("getFinalPdfDownloadUrl", () => {
  let request, response, next, existingCase, getSignedUrlMock, referralLetter;
  beforeEach(async () => {
    getSignedUrlMock = jest.fn(() => "url");
    createConfiguredS3Instance.mockImplementation(() => ({
      getSignedUrl: getSignedUrlMock
    }));

    const complainantCivilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT);

    const complainantOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const complainantOfficer = await models.officer.create(
      complainantOfficerAttributes,
      { auditUser: "test" }
    );

    const complainantCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withOfficerId(complainantOfficer.id);

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(12070)
      .withFirstContactDate("2017-12-25")
      .withIncidentDate("2016-01-01")
      .withComplaintType(CIVILIAN_INITIATED)
      .withComplainantCivilians([complainantCivilianAttributes])
      .withComplainantOfficers([complainantCaseOfficerAttributes]);

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "test"
        },
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "test"
        }
      ],
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

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withFinalPdfFilename("filename");

    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
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
    await getFinalPdfDownloadUrl(request, response, next);

    const createdAudit = await models.action_audit.findOne();
    expect(createdAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(createdAudit.action).toEqual(AUDIT_ACTION.DOWNLOADED);
    expect(createdAudit.user).toEqual("TEST_USER_NICKNAME");
    expect(createdAudit.caseId).toEqual(existingCase.id);
    expect(createdAudit.subject).toEqual(
      AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF
    );
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

    await getFinalPdfDownloadUrl(request, response, next);

    const filenameWithCaseId = `${existingCase.id}/${
      referralLetter.finalPdfFilename
    }`;

    expect(getSignedUrlMock).toHaveBeenCalledWith(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filenameWithCaseId,
      Expires: S3_URL_EXPIRATION
    });
    expect(response._getData()).toEqual("url");
  });

  test("should retrieve download url for pdf when archived", async () => {
    await existingCase.update(
      { status: CASE_STATUS.FORWARDED_TO_AGENCY },
      { auditUser: "someone" }
    );

    await existingCase.destroy({ auditUser: "someone" });
    const getSignedUrlMock = jest.fn(() => "url");
    createConfiguredS3Instance.mockImplementation(() => ({
      getSignedUrl: getSignedUrlMock
    }));

    await getFinalPdfDownloadUrl(request, response, next);

    const filenameWithCaseId = `${existingCase.id}/${
      referralLetter.finalPdfFilename
    }`;

    expect(getSignedUrlMock).toHaveBeenCalledWith(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filenameWithCaseId,
      Expires: S3_URL_EXPIRATION
    });
    expect(response._getData()).toEqual("url");
  });

  test("returns 400 bad request if case is in status before forwarded to agency", async () => {
    await getFinalPdfDownloadUrl(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS)
    );
  });
});
