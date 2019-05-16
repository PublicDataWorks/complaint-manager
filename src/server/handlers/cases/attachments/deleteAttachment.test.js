import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
import models from "../../../models/index";
import deleteAttachment from "./deleteAttachment";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";

const httpMocks = require("node-mocks-http");
const AWS = require("aws-sdk");

jest.mock("aws-sdk");

//mocked implementation in "/handlers/__mocks__/getQueryAuditAccessDetails"
jest.mock("../../getQueryAuditAccessDetails");

describe("deleteAttachment", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  AWS.S3.mockImplementation(() => ({
    deleteObject: () => ({
      promise: jest.fn()
    }),
    config: {
      loadFromPath: jest.fn(),
      update: jest.fn()
    }
  }));

  test("should audit data access when attachment deleted", async () => {
    const existingCase = await createTestCaseWithoutCivilian();

    const attachmentAttributes = new Attachment.Builder()
      .defaultAttachment()
      .withCaseId(existingCase.id)
      .withId(undefined);

    const attachment = await models.attachment.create(attachmentAttributes, {
      auditUser: "tuser"
    });

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: attachment.caseId,
        fileName: attachment.fileName
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await deleteAttachment(request, response, next);

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        caseId: existingCase.id,
        user: "TEST_USER_NICKNAME",
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        auditDetails: { ["Mock Attribute"]: ["Mock Details"] }
      })
    );
  });
});
