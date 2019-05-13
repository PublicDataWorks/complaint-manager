import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../client/testUtilities/attachment";
import models from "../../../models/index";
import deleteAttachment from "./deleteAttachment";
const httpMocks = require("node-mocks-http");
import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import mockLodash from "lodash";
const AWS = require("aws-sdk");

jest.mock("aws-sdk");

jest.mock("../../getQueryAuditAccessDetails", () => ({
  addToExistingAuditDetails: jest.fn(
    (existingDetails, queryOptions, topLevelModelName) => {
      existingDetails[mockLodash.camelCase(topLevelModelName)] = {
        attributes: ["mockDetails"]
      };
    }
  ),
  removeFromExistingAuditDetails: jest.fn()
}));

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
        auditDetails: { Case: ["Is Archived", "Mock Details", "Pdf Available"] }
      })
    );
  });
});
