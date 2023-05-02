import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import Attachment from "../../../../sharedTestHelpers/attachment";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import models from "../../../policeDataManager/models/index";
import deleteAttachment from "./deleteAttachment";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";

const httpMocks = require("node-mocks-http");

const mockS3 = {
  deleteObject: jest.fn(() => Promise.resolve())
};
jest.mock("../../../createConfiguredS3Instance", () => jest.fn(() => mockS3));

jest.mock("../../audits/auditDataAccess");

describe("deleteAttachment", function () {
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("auditing", () => {
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
          caseId: attachment.caseId
        },
        query: {
          fileName: attachment.fileName
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.EDIT_CASE
      });

      const response = httpMocks.createResponse();
      const next = jest.fn();

      await deleteAttachment(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        existingCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
