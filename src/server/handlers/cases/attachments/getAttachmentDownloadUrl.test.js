import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getAttachmentDownloadUrl from "./getAttachmentDownloadUrl";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
import ComplainantLetter from "../../../../client/testUtilities/complainantLetter";
import Civilian from "../../../../client/testUtilities/civilian";

const httpMocks = require("node-mocks-http");
const AWS = require("aws-sdk");
const models = require("../../../models/index");

jest.mock("aws-sdk");

describe("getAttachmentDownloadUrl", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  const SIGNED_TEST_URL = "SIGNED_TEST_URL";
  let existingCase;

  beforeEach(async () => {
    existingCase = await createTestCaseWithoutCivilian();
    AWS.S3.mockImplementation(() => ({
      getSignedUrl: () => {
        return SIGNED_TEST_URL;
      },
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
      nickname: "TEST_USER_NICKNAME"
    });
    return { attachment, request };
  }

  test("should audit data access when attachment downloaded", async () => {
    const { attachment, request } = await requestWithExistingCaseAttachment();

    const response = httpMocks.createResponse();

    await getAttachmentDownloadUrl(request, response, jest.fn());

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        caseId: attachment.caseId,
        user: "TEST_USER_NICKNAME",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DOWNLOADED,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        subjectDetails: { fileName: [attachment.fileName] }
      })
    );
  });
  test("should audit complainant letter data access", async () => {
    const { attachment, request } = await requestWithExistingCaseAttachment();

    const response = httpMocks.createResponse();
    response.write = jest.fn();

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
      .withComplainantCivilianId(civilian.id)
      .withFinalPdfFilename(attachment.fileName);
    await models.complainant_letter.create(complainantLetterAttributes, {
      auditUser: "tuser"
    });

    const signedUrl = await getAttachmentDownloadUrl(
      request,
      response,
      jest.fn()
    );

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        action: AUDIT_ACTION.DOWNLOADED,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        caseId: existingCase.id,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: "TEST_USER_NICKNAME",
      })
    );
  });

  test("should response with a singed download url for an attachment", async () => {
    const { attachment, request } = await requestWithExistingCaseAttachment();

    const response = httpMocks.createResponse();
    response.write = jest.fn();

    await getAttachmentDownloadUrl(request, response, jest.fn());

    expect(response.write).toHaveBeenCalledWith(SIGNED_TEST_URL);
  });

  test("should not audit data access when generation of download url fails", async () => {
    AWS.S3.mockImplementation(() => ({
      getSignedUrl: () => {
        throw new Error();
      }
    }));

    const { attachment, request } = await requestWithExistingCaseAttachment();

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
