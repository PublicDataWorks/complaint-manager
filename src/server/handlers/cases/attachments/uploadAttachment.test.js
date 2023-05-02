import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import uploadAttachment from "./uploadAttachment";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import models from "../../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import Busboy from "busboy";
import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import { auditFileAction } from "../../audits/auditFileAction";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../../sharedUtilities/constants";
import Attachment from "../../../../sharedTestHelpers/attachment";
import Boom from "boom";

jest.mock("../referralLetters/sharedLetterUtilities/auditUpload");
jest.mock("../../getCaseHelpers");
jest.mock("../../audits/auditFileAction");
jest.mock("../../audits/auditDataAccess");
jest.mock("../referralLetters/sharedLetterUtilities/uploadLetterToS3");
jest.mock("../../getCaseHelpers", () => {
  return {
    getCaseWithAllAssociationsAndAuditDetails: jest.fn(
      (caseId, transaction) => {
        return {
          caseDetails: {},
          auditDetails: {}
        };
      }
    )
  };
});

jest.mock("busboy");
Busboy.mockImplementation(() => {
  return {
    on: jest.fn(async (field, func) => {
      if (field === "field") {
        await func("description", "dummy description");
      }
      if (field === "file") {
        await func(jest.fn(), jest.fn(), { filename: "test_filename" });
      }
    })
  };
});

jest.mock("../../../createConfiguredS3Instance");

describe("uploadAttachment", () => {
  let request, response, next, existingCase;

  const testUser = "Rabbid Penguin";

  beforeEach(async () => {
    await cleanupDatabase();

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    response = httpMocks.createResponse();
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: testUser,
      pipe: jest.fn()
    });

    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should set access-control-allow-origin response header if only in the development env", async () => {
    process.env.NODE_ENV = "development";

    await uploadAttachment(request, response, next);

    expect(response._headers).toEqual(
      expect.objectContaining({
        "access-control-allow-origin": "https://localhost"
      })
    );
  });

  test("should return 400 if request is archived", async () => {
    process.env.NODE_ENV = "development";

    request.isArchived = true;
    await uploadAttachment(request, response, next);

    expect(response.statusCode).toEqual(400);
  });

  test("should return 409 if filename exists", async () => {
    process.env.NODE_ENV = "development";

    await models.attachment.create(
      new Attachment.Builder()
        .defaultAttachment()
        .withFileName("test_filename")
        .withCaseId(existingCase.id),
      { auditUser: "user" }
    );

    await uploadAttachment(request, response, next);

    expect(response.statusCode).toEqual(409);
  });

  test("should throw bad implementation error if case doesn't exist", async () => {
    process.env.NODE_ENV = "development";

    request.params.caseId = 9999;
    await uploadAttachment(request, response, next);

    expect(next).toHaveBeenCalled();
  });

  describe("auditing", () => {
    test("should call auditFileAction when uploading an attachment", async () => {
      uploadLetterToS3.mockClear();

      await uploadAttachment(request, response, next);

      expect(auditFileAction).toHaveBeenCalledWith(
        testUser,
        existingCase.id,
        AUDIT_ACTION.UPLOADED,
        "test_filename",
        AUDIT_FILE_TYPE.ATTACHMENT,
        expect.anything()
      );
    });
  });
});
