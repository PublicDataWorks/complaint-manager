import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import generateAttachmentDownloadUrl from "./generateAttachmentDownloadUrl";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";

const httpMocks = require("node-mocks-http");
const AWS = require("aws-sdk");
const models = require("../../../models/index");

jest.mock("aws-sdk");

describe("generateAttachmentDownloadUrl", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  const SIGNED_TEST_URL = "SIGNED_TEST_URL";

  beforeEach(() => {
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
    const existingCase = await createCaseWithoutCivilian();
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
        id: attachment.caseId,
        fileName: attachment.fileName
      },
      nickname: "TEST_USER_NICKNAME"
    });
    return { attachment, request };
  }

  test("should audit data access when attachment downloaded", async () => {
    const { attachment, request } = await requestWithExistingCaseAttachment();

    const response = httpMocks.createResponse();

    await generateAttachmentDownloadUrl(request, response, jest.fn());

    const actionAudit = await models.action_audit.find({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        caseId: attachment.caseId,
        user: "TEST_USER_NICKNAME",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DOWNLOADED,
        subject: AUDIT_SUBJECT.ATTACHMENTS,
        subjectDetails: { fileName: attachment.fileName }
      })
    );
  });

  test("should response with a singed download url for an attachment", async () => {
    const { attachment, request } = await requestWithExistingCaseAttachment();

    const response = httpMocks.createResponse();
    response.write = jest.fn();

    await generateAttachmentDownloadUrl(request, response, jest.fn());

    expect(response.write).toHaveBeenCalledWith(SIGNED_TEST_URL);
  });

  test("should not audit data access when generation of download url fails", async () => {
    AWS.S3.mockImplementation(() => ({
      getSignedUrl: () => {
        throw new Error();
      }
    }));

    const { attachment, request } = await requestWithExistingCaseAttachment();

    await generateAttachmentDownloadUrl(
      request,
      httpMocks.createResponse(),
      jest.fn()
    );

    const actionAudit = await models.action_audit.find({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toBeNull();
  });
});
