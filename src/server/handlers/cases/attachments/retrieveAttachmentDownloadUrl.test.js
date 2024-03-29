import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import retrieveAttachmentDownloadUrl from "./retrieveAttachmentDownloadUrl";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../sharedTestHelpers/attachment";
import ComplainantLetter from "../../../testHelpers/complainantLetter";
import Civilian from "../../../../sharedTestHelpers/civilian";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import ReferralLetter from "../../../testHelpers/ReferralLetter";
import { auditFileAction } from "../../audits/auditFileAction";

const httpMocks = require("node-mocks-http");
const models = require("../../../policeDataManager/models/index");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const SIGNED_TEST_URL = "SIGNED_TEST_URL";
const mockS3 = {
  getSignedUrl: jest.fn()
};
jest.mock("../../../createConfiguredS3Instance", () => jest.fn(() => mockS3));

jest.mock("../../audits/auditFileAction");

describe("retrieveAttachmentDownloadUrl", function () {
  const testUser = "April Ludgate";

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let existingCase;

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    auditFileAction.mockClear();
    existingCase = await createTestCaseWithoutCivilian();
    mockS3.getSignedUrl.mockImplementation(async () => SIGNED_TEST_URL);
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
        caseId: attachment.caseId
      },
      query: { fileName: attachment.fileName },
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
        caseId: complainantLetter.caseId
      },
      query: {
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
        caseId: referralLetter.caseId
      },
      query: {
        fileName: referralLetter.finalPdfFilename
      },
      nickname: testUser
    });
    return { referralLetter, request };
  }

  describe("auditing", () => {
    test("should audit data access when attachment downloaded", async () => {
      const { request } = await requestWithExistingCaseAttachment();

      const response = httpMocks.createResponse();

      await retrieveAttachmentDownloadUrl(request, response, jest.fn());

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.DOWNLOADED,
        request.query.fileName,
        AUDIT_FILE_TYPE.ATTACHMENT,
        expect.anything()
      );
    });

    test("should audit referral letter data access", async () => {
      const { request } = await requestWithReferralLetter();

      const response = httpMocks.createResponse();
      response.write = jest.fn();

      await retrieveAttachmentDownloadUrl(request, response, jest.fn());

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.DOWNLOADED,
        request.query.fileName,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        expect.anything()
      );
    });

    test("should audit complainant letter data access", async () => {
      const { request } = await requestWithComplainantLetter();

      const response = httpMocks.createResponse();

      response.write = jest.fn();

      await retrieveAttachmentDownloadUrl(request, response, jest.fn());

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.DOWNLOADED,
        request.query.fileName,
        AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
        expect.anything()
      );
    });

    test("should throw error when generation of download url fails", async () => {
      const err = new Error(
        "specifically an url generation error... not a random error"
      );
      const next = jest.fn();
      mockS3.getSignedUrl.mockImplementation(() => {
        throw err;
      });

      const { request } = await requestWithExistingCaseAttachment();

      await retrieveAttachmentDownloadUrl(
        request,
        httpMocks.createResponse(),
        next
      );

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getSignedUrl", function () {
    test("should respond with a signed download url for an attachment and send correct variables to getSignedUrl", async () => {
      const { attachment, request } = await requestWithExistingCaseAttachment();

      const response = httpMocks.createResponse();
      response.write = jest.fn();
      const next = jest.fn();

      await retrieveAttachmentDownloadUrl(request, response, next);

      expect(response.write).toHaveBeenCalledWith(SIGNED_TEST_URL);
      expect(mockS3.getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].s3Bucket,
          Key: `${attachment.caseId}/${attachment.fileName}`,
          Expires: S3_URL_EXPIRATION
        })
      );
    });

    test("should call getSignedUrl with complainant letter bucket and key when complainant letter", async () => {
      const { complainantLetter, request } =
        await requestWithComplainantLetter();

      const response = httpMocks.createResponse();

      await retrieveAttachmentDownloadUrl(request, response, jest.fn());

      expect(mockS3.getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].complainantLettersBucket,
          Key: `${complainantLetter.caseId}/${complainantLetter.finalPdfFilename}`
        })
      );
    });

    test("should call getSignedUrl with referral letter bucket and key when referral letter", async () => {
      const { referralLetter, request } = await requestWithReferralLetter();

      const response = httpMocks.createResponse();

      await retrieveAttachmentDownloadUrl(request, response, jest.fn());

      expect(mockS3.getSignedUrl).toHaveBeenCalledWith(
        S3_GET_OBJECT,
        expect.objectContaining({
          Bucket: config[process.env.NODE_ENV].referralLettersBucket,
          Key: `${referralLetter.caseId}/${referralLetter.finalPdfFilename}`
        })
      );
    });
  });
});
