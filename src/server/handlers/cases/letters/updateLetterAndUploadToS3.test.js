import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../referralLetters/constructFilename";
import _ from "lodash";
import updateLetterAndUploadTos3 from "./updateLetterAndUploadTos3";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Letter from "../../../../sharedTestHelpers/Letter";
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
  () => (c4se, pdfLetterType) => {
    return "pinapple_house.pdf";
  }
);

describe("Generate letter and upload to S3", () => {
  let c4se, request, response, next, signer, initialLetter;
  let i = 0;

  beforeEach(async () => {
    await cleanupDatabase();
    const caseAttributes = new Case.Builder().defaultCase().build();
    const signerAttr = new Signer.Builder().defaultSigner().build();
    signer = await models.signers.create(signerAttr, {
      auditUser: "user"
    });

    c4se = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.caseStatus,
          as: "status",
          auditUser: "test"
        }
      ],
      auditUser: "test"
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
      { auditUser: "test" }
    );

    initialLetter = await models.letter.create(
      new Letter.Builder()
        .defaultLetter()
        .withTypeId(letterType.id)
        .withCaseId(c4se.id)
        .build(),
      {
        auditUser: "test"
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
    const finalPdfFilename = constructFilename(c4se, "EDIT LETTER");
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
    response = httpMocks.createResponse();
    await updateLetterAndUploadTos3(request, response, next);
    const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
    const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");
    console.log("CASEID>>", c4se.id);
    const newAttachment = await models.attachment.findOne({
      where: {
        caseId: c4se.id,
        description: request.body.letter.letterType.type
      }
    });
    expect(response.statusCode).toEqual(200);
    const letter = await models.letter.findByPk(initialLetter.id);
    expect(letter).toBeTruthy();
    expect(letter.typeId).toEqual(1);
    console.log(letter.finalPdfFilename);
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

  //   test("should generate letter and attach to case (editable)", async () => {
  //     request = httpMocks.createRequest({
  //       method: "POST",
  //       headers: {
  //         authorization: "Bearer token"
  //       },
  //       body: {
  //         type: "EDIT LETTER"
  //       },
  //       params: { caseId: c4se.id },
  //       nickname: "Barbra Matrix",
  //       permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
  //     });
  //     response = httpMocks.createResponse();
  //     await updateLetterAndUploadTos3(request, response, next);
  //     const finalPdfFilename = constructFilename(c4se, "TEST LETTER");
  //     const pdfName = finalPdfFilename.substring(0, finalPdfFilename.length - 4);
  //     const regEx = new RegExp("(?:" + pdfName + ")[_][0-9]*.(?:.pdf)");

  //     expect(response.statusCode).toEqual(200);
  //     const letter = await models.letter.findByPk(response._getData().id);
  //     expect(letter).toBeTruthy();
  //     expect(letter.typeId).toEqual(1);

  //     expect(letter.finalPdfFilename).toMatch(regEx);
  //   });
});
