import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../referralLetters/constructFilename";
import _ from "lodash";
import generateLetterAndUploadToS3 from "./generateLetterAndUploadToS3";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import { dateTimeFromString } from "../../../../sharedUtilities/formatDate";
import moment from "moment";

jest.mock("../referralLetters/sharedLetterUtilities/uploadLetterToS3", () =>
  jest.fn()
);
jest.mock("../referralLetters/sharedLetterUtilities/generatePdfBuffer", () =>
  jest.fn(() => {
    return "pdf buffer";
  })
);
jest.mock("../referralLetters/generateLetterPdfBuffer", () => caseId => {
  return { pdfBuffer: `Generated pdf for ${caseId}`, auditDetails: {} };
});
jest.mock(
  "../referralLetters/constructFilename",
  () => (existingCase, pdfLetterType) => {
    return "TEST_LETTER.pdf";
  }
);

describe("Generate letter and upload to S3", () => {
  let existingCase, request, response, next, signer;
  let i = 0;

  beforeEach(async () => {
    await cleanupDatabase();
    const caseAttributes = new Case.Builder().defaultCase().build();
    const signerAttr = new Signer.Builder().defaultSigner().build();
    signer = await models.signers.create(signerAttr, {
      auditUser: "user"
    });

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.caseStatus,
          as: "status",
          auditUser: "test"
        }
      ],
      auditUser: "test"
    });

    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
    uploadLetterToS3.mockClear();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should generate letter and attach to case", async () => {
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("TEST LETTER")
        .withTemplate("Test letter template")
        .withDefaultSender(signer)
        .build(),
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        type: "TEST LETTER"
      },
      params: { caseId: existingCase.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });
    response = httpMocks.createResponse();
    await generateLetterAndUploadToS3(request, response, next);
    const finalPdfFilename = constructFilename(existingCase, "TEST LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[0-9]*.(?:.pdf)");
    const newAttachment = await models.attachment.findOne({
      where: { caseId: existingCase.id, description: request.body.type }
    });

    expect(response.statusCode).toEqual(200);
    const letter = await models.letter.findByPk(response._getData().id);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    expect(uploadLetterToS3).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "noipm-local"
    );

    expect(newAttachment.caseId).toEqual(existingCase.id);
    expect(newAttachment.description).toEqual(expect.anything());
    expect(newAttachment.fileName).toMatch(regEx);
  });

  test("should generate letter and attach to case (editable)", async () => {
    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("EDIT LETTER")
        .withTemplate("Test letter template editable")
        .withEditableTemplate("HTML goes here")
        .withDefaultSender(signer)
        .withHasEditPage(true)
        .build(),
      { auditUser: "test" }
    );
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        type: "EDIT LETTER"
      },
      params: { caseId: existingCase.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });
    response = httpMocks.createResponse();
    await generateLetterAndUploadToS3(request, response, next);
    const finalPdfFilename = constructFilename(existingCase, "TEST LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[0-9]*.(?:.pdf)");

    expect(response.statusCode).toEqual(200);
    const letter = await models.letter.findByPk(response._getData().id);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);

    expect(letter.finalPdfFilename).toMatch(regEx);
  });
});
