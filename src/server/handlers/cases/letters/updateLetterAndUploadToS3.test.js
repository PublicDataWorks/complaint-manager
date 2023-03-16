import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import _ from "lodash";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../referralLetters/constructFilename";
import updateLetterAndUploadToS3 from "./updateLetterAndUploadToS3";
import Case from "../../../../sharedTestHelpers/case";
import Letter from "../../../../sharedTestHelpers/Letter";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";

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

describe("Update letter and upload to S3", () => {
  let c4se, request, response, next, signer, initialLetter;

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

    const letterType = await models.letter_types.create(
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

    initialLetter = await models.letter.create(
      new Letter.Builder()
        .defaultLetter()
        .withTypeId(letterType.id)
        .withCaseId(c4se.id)
        .build(),
      {
        auditUser: "test user"
      }
    );

    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
    uploadLetterToS3.mockClear();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should update letter and attach to case", async () => {
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      body: {
        letter: {
          letterType: { type: "EDIT LETTER" },
          finalPdfFilename: undefined
        }
      },
      params: { caseId: c4se.id, letterId: initialLetter.id },
      nickname: "Barbra Matrix",
      permissions: [`${USER_PERMISSIONS.SETUP_LETTER}`]
    });

    await updateLetterAndUploadToS3(request, response, next);

    const finalPdfFilename = constructFilename(c4se, "EDIT LETTER");
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");

    const letter = await models.letter.findByPk(initialLetter.id);

    const newAttachment = await models.attachment.findOne({
      where: {
        caseId: c4se.id,
        description: request.body.letter.letterType.type
      }
    });

    expect(response.statusCode).toEqual(200);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    expect(letter.finalPdfFilename).toMatch(regEx);
    expect(uploadLetterToS3).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "noipm-local"
    );
    expect(newAttachment.caseId).toEqual(c4se.id);
    expect(newAttachment.description).toEqual(expect.anything());
    expect(newAttachment.fileName).toMatch(regEx);
  });
});
