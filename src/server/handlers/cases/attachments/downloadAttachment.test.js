import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import downloadAttachment from "./downloadAttachment";
const httpMocks = require("node-mocks-http");
import {
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  DOWNLOADED
} from "../../../../sharedUtilities/constants";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
const AWS = require("aws-sdk");
const models = require("../../../models/index");

jest.mock("aws-sdk");

describe("downloadAttachment", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(() => {
    AWS.S3.mockImplementation(() => ({
      getObject: () => ({
        createReadStream: () => ({
          pipe: jest.fn()
        })
      }),
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      }
    }));
  });

  test("should audit data access when attachment deleted", async () => {
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

    const response = httpMocks.createResponse();
    response.attachment = jest.fn();

    const next = jest.fn();

    await downloadAttachment(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        caseId: attachment.caseId,
        user: "TEST_USER_NICKNAME",
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DOWNLOADED,
        subject: AUDIT_SUBJECT.ATTACHMENTS,
        subjectDetails: { fileName: attachment.fileName }
      })
    );
  });

  test("should not audit data access when download fails", async () => {
    AWS.S3.mockImplementation(() => ({
      getObject: () => {
        throw new Error();
      }
    }));

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

    const response = httpMocks.createResponse();
    response.attachment = jest.fn();

    const next = jest.fn();

    await downloadAttachment(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: attachment.caseId }
    });

    expect(actionAudit).toBeNull();
  });
});
