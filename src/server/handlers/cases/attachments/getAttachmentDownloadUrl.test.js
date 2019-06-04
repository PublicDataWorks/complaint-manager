import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getAttachmentDownloadUrl from "./getAttachmentDownloadUrl";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
import ComplainantLetter from "../../../../client/testUtilities/complainantLetter";
import Civilian from "../../../../client/testUtilities/civilian";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import { auditFileAction } from "../../audits/auditFileAction";

const httpMocks = require("node-mocks-http");
const AWS = require("aws-sdk");
const models = require("../../../models/index");
const config = require("../../../config/config");

jest.mock("aws-sdk");

jest.mock("../../audits/auditFileAction");

describe("getAttachmentDownloadUrl", function() {
  const testUser = "April Ludgate";

  afterEach(async () => {
    await cleanupDatabase();
  });

  const SIGNED_TEST_URL = "SIGNED_TEST_URL";
  let existingCase;
  let s3;
  let getSignedUrl;

  beforeEach(async () => {
    auditFileAction.mockClear();
    existingCase = await createTestCaseWithoutCivilian();
    getSignedUrl = jest.fn().mockImplementation(() => {
      return SIGNED_TEST_URL;
    });
    s3 = AWS.S3.mockImplementation(() => ({
      getSignedUrl: getSignedUrl,
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      }
    }));
  });

  async function requestWithExistingCaseAttachment() {
    const attachmentAttributes = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(existingCase.id);
    const attachment = await models.attachment.create(attachmentAttributes, {
      auditUser: "tuser"
    });

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: attachment.caseId,
        fileName: attachment.fileName
      },
      nickname: testUser
    });
    return { attachment, request };
  }

  async function requestWithComplainantLetter() {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(existingCase.id);
    const civilian = await models.civilian.create(civilianAttributes, {
      auditUser: "tuser"
    });
    const complainantLetterAttributes = new ComplainantLetter.Builder()
      .defaultComplainantLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withComplainantCivilianId(civilian.id);
    const complainantLetter = await models.complainant_letter.create(
      complainantLetterAttributes,
      {
        auditUser: "tuser"
      }
    );
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: complainantLetter.caseId,
        fileName: complainantLetter.finalPdfFilename
      },
      nickname: testUser
    });
    return { complainantLetter, request };
  }

  async function requestWithReferralLetter() {
    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withFinalPdfFilename("final_referral_letter.pdf");
    const referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "test user"
      }
    );
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: referralLetter.caseId,
        fileName: referralLetter.finalPdfFilename
      },
      nickname: testUser
    });
    return { referralLetter, request };
  }
  describe("audit", function() {
    describe("newAuditFeature toggled off", () => {
      test("should audit data access when attachment downloaded", async () => {
        const {
          attachment,
          request
        } = await requestWithExistingCaseAttachment();

        const response = httpMocks.createResponse();

        request.fflip = mockFflipObject({ newAuditFeature: false });

        await getAttachmentDownloadUrl(request, response, jest.fn());

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: attachment.caseId }
        });

        expect(actionAudit).toEqual(
          expect.objectContaining({
            caseId: attachment.caseId,
            user: testUser,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            action: AUDIT_ACTION.DOWNLOADED,
            subject: AUDIT_SUBJECT.ATTACHMENT,
            auditDetails: { fileName: [attachment.fileName] }
          })
        );
      });

      test("should audit complainant letter data access", async () => {
        const {
          complainantLetter,
          request
        } = await requestWithComplainantLetter();

        const response = httpMocks.createResponse();
        response.write = jest.fn();

        request.fflip = mockFflipObject({ newAuditFeature: false });

        const signedUrl = await getAttachmentDownloadUrl(
          request,
          response,
          jest.fn()
        );

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: complainantLetter.caseId }
        });

        expect(actionAudit).toEqual(
          expect.objectContaining({
            action: AUDIT_ACTION.DOWNLOADED,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            caseId: existingCase.id,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser
          })
        );
      });

      test("should audit referral letter data access", async () => {
        const { referralLetter, request } = await requestWithReferralLetter();

        const response = httpMocks.createResponse();
        response.write = jest.fn();

        request.fflip = mockFflipObject({ newAuditFeature: false });

        await getAttachmentDownloadUrl(request, response, jest.fn());

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: referralLetter.caseId }
        });

        expect(actionAudit).toEqual(
          expect.objectContaining({
            action: AUDIT_ACTION.DOWNLOADED,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            caseId: existingCase.id,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser
          })
        );
      });

      test("should not audit data access when generation of download url fails", async () => {
        AWS.S3.mockImplementation(() => ({
          getSignedUrl: () => {
            throw new Error();
          }
        }));

        const {
          attachment,
          request
        } = await requestWithExistingCaseAttachment();

        request.fflip = mockFflipObject({ newAuditFeature: false });

        await getAttachmentDownloadUrl(
          request,
          httpMocks.createResponse(),
          jest.fn()
        );

        const actionAudit = await models.action_audit.findOne({
          where: { caseId: attachment.caseId }
        });

        expect(actionAudit).toBeNull();
      });
    });

    describe("newAuditFeature toggled on", () => {
      test("should audit data access when attachment downloaded", async () => {
        const { request } = await requestWithExistingCaseAttachment();

        const response = httpMocks.createResponse();

        request.fflip = mockFflipObject({ newAuditFeature: true });

        await getAttachmentDownloadUrl(request, response, jest.fn());

        expect(auditFileAction).toHaveBeenCalledWith(
          testUser,
          existingCase.id,
          AUDIT_ACTION.DOWNLOADED,
          request.params.fileName,
          AUDIT_FILE_TYPE.ATTACHMENT,
          expect.anything()
        );
      });

      test("should audit referral letter data access", async () => {
        const { request } = await requestWithReferralLetter();

        request.fflip = mockFflipObject({ newAuditFeature: true });

        const response = httpMocks.createResponse();
        response.write = jest.fn();

        await getAttachmentDownloadUrl(request, response, jest.fn());

        expect(auditFileAction).toHaveBeenCalledWith(
          testUser,
          existingCase.id,
          AUDIT_ACTION.DOWNLOADED,
          request.params.fileName,
          AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
          expect.anything()
        );
      });

      test("should audit complainant letter data access", async () => {
        const { request } = await requestWithComplainantLetter();

        const response = httpMocks.createResponse();

        response.write = jest.fn();

        request.fflip = mockFflipObject({ newAuditFeature: true });

        await getAttachmentDownloadUrl(request, response, jest.fn());

        expect(auditFileAction).toHaveBeenCalledWith(
          testUser,
          existingCase.id,
          AUDIT_ACTION.DOWNLOADED,
          request.params.fileName,
          AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
          expect.anything()
        );
      });

      test("should not audit data access when generation of download url fails", async () => {
        AWS.S3.mockImplementation(() => ({
          getSignedUrl: () => {
            throw new Error();
          }
        }));

        const { request } = await requestWithExistingCaseAttachment();

        request.fflip = mockFflipObject({ newAuditFeature: true });

        await getAttachmentDownloadUrl(
          request,
          httpMocks.createResponse(),
          jest.fn()
        );

        expect(auditFileAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("getSignedUrl", function() {
    test("should respond with a signed download url for an attachment and send correct variables to getSignedUrl", async () => {
      const { attachment, request } = await requestWithExistingCaseAttachment();

      const response = httpMocks.createResponse();
      response.write = jest.fn();

      await getAttachmentDownloadUrl(request, response, jest.fn());

      expect(response.write).toHaveBeenCalledWith(SIGNED_TEST_URL);
      expect(getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].s3Bucket,
          Key: `${attachment.caseId}/${attachment.fileName}`,
          Expires: S3_URL_EXPIRATION
        })
      );
    });

    test("should call getSignedUrl with complainant letter bucket and key when complainant letter", async () => {
      const {
        complainantLetter,
        request
      } = await requestWithComplainantLetter();

      const response = httpMocks.createResponse();

      await getAttachmentDownloadUrl(request, response, jest.fn());

      expect(getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].complainantLettersBucket,
          Key: `${complainantLetter.caseId}/${
            complainantLetter.finalPdfFilename
          }`
        })
      );
    });

    test("should call getSignedUrl with referral letter bucket and key when referral letter", async () => {
      const { referralLetter, request } = await requestWithReferralLetter();

      const response = httpMocks.createResponse();

      await getAttachmentDownloadUrl(request, response, jest.fn());

      expect(getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].referralLettersBucket,
          Key: `${referralLetter.caseId}/${referralLetter.finalPdfFilename}`
        })
      );
    });
  });
});
