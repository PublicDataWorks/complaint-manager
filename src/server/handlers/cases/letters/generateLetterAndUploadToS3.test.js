import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import _ from "lodash";
import Case from "../../../../sharedTestHelpers/case";
import {
  ADDRESSABLE_TYPE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../referralLetters/constructFilename";
import generateLetterAndUploadToS3 from "./generateLetterAndUploadToS3";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";
import Civilian from "../../../../sharedTestHelpers/civilian";
import Address from "../../../../sharedTestHelpers/Address";

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
  let c4se, request, response, next, signer;

  beforeEach(async () => {
    await cleanupDatabase();

    response = httpMocks.createResponse();

    signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      {
        auditUser: "test user"
      }
    );

    c4se = await models.cases.create(new Case.Builder().defaultCase().build(), {
      include: [
        {
          model: models.caseStatus,
          as: "status",
          auditUser: "test user"
        }
      ],
      auditUser: "test user"
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
    const type = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("TEST LETTER")
        .withTemplate("Test letter template")
        .withDefaultSender(signer)
        .withDefaultRecipient("Bob")
        .withDefaultRecipientAddress("123 Bob St.")
        .build(),
      { auditUser: "test user" }
    );

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        type: "TEST LETTER"
      },
      params: { caseId: c4se.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });

    await generateLetterAndUploadToS3(request, response, next);

    const finalPdfFilename = constructFilename(c4se, "TEST LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");

    const letter = await models.letter.findByPk(response._getData().id);

    const newAttachment = await models.attachment.findOne({
      where: { caseId: c4se.id, description: request.body.type }
    });

    expect(response.statusCode).toEqual(200);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    expect(letter.sender).toEqual(
      `${signer.name}\n${signer.title}\n${signer.phone}`
    );
    expect(letter.recipient).toEqual(type.defaultRecipient);
    expect(letter.recipientAddress).toEqual(type.defaultRecipientAddress);
    expect(uploadLetterToS3).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "noipm-local"
    );
    expect(newAttachment.caseId).toEqual(c4se.id);
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
      { auditUser: "test user" }
    );

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        type: "EDIT LETTER"
      },
      params: { caseId: c4se.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });

    await generateLetterAndUploadToS3(request, response, next);

    const finalPdfFilename = constructFilename(c4se, "TEST LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");

    const letter = await models.letter.findByPk(response._getData().id);

    expect(response.statusCode).toEqual(200);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    expect(letter.finalPdfFilename).toMatch(regEx);
  });

  test("should set recipient and address by the primary complainant if {primaryComplainant} and {primaryComplainant} address are the defaults", async () => {
    const civilian = await models.civilian.create(
      new Civilian.Builder().defaultCivilian().withCaseId(c4se.id).build(),
      { auditUser: "user" }
    );

    await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withAddressableId(civilian.id)
        .build(),
      { auditUser: "user" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("EDIT LETTER")
        .withTemplate("Test letter template editable")
        .withEditableTemplate("HTML goes here")
        .withDefaultSender(signer)
        .withHasEditPage(true)
        .withDefaultRecipient("{primaryComplainant}")
        .withDefaultRecipientAddress("{primaryComplainantAddress}")
        .build(),
      { auditUser: "test user" }
    );

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        type: "EDIT LETTER"
      },
      params: { caseId: c4se.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
    });

    await generateLetterAndUploadToS3(request, response, next);

    const finalPdfFilename = constructFilename(c4se, "TEST LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");

    const letter = await models.letter.findByPk(response._getData().id);

    expect(response.statusCode).toEqual(200);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    expect(letter.recipient).toEqual(civilian.fullName);
    expect(letter.recipientAddress).toEqual(
      "123 Main St\nFl 2\nSandwich, IL 63456"
    );
  });
});
