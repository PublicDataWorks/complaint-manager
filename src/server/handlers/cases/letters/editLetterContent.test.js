import Letter from "../../../../sharedTestHelpers/Letter";
import models from "../../../policeDataManager/models";
import httpMocks from "node-mocks-http";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import editLetterContent from "./editLetterContent";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import Signer from "../../../../sharedTestHelpers/signer";
import LetterType from "../../../../sharedTestHelpers/letterType";

describe("Edit letter", () => {
  let c4se, letter, letterType, response, next;

  beforeEach(async () => {
    await cleanupDatabase();
    response = httpMocks.createResponse();
    next = jest.fn();

    let signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      { auditUser: "test user" }
    );

    letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("TEST LETTER TYPE")
        .withEditableTemplate("This is the letter template")
        .withDefaultSender(signer)
        .build(),
      { auditUser: "test user" }
    );

    let caseStatus = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "test user" }
    );

    c4se = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withStatus(caseStatus)
        .withFirstContactDate("1-27-2023")
        .build(),
      { auditUser: "test user" }
    );

    letter = await models.letter.create(
      new Letter.Builder()
        .defaultLetter()
        .withCaseId(c4se.id)
        .withTypeId(letterType.id)
        .build(),
      { auditUser: "test user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  const newEditedLetterHtml = "<p>new letter content</p>";

  test("save edited letter html content", async () => {
    const request = requestWithUpdatedLetterContent();

    await editLetterContent(request, response, next);

    await letter.reload();
    expect(letter.editedLetterHtml).toEqual(newEditedLetterHtml);
  });

  test("throws exception when there is no letter with the case id", async () => {
    c4se = await models.cases.create(
      new Case.Builder().defaultCase().withId(undefined).build(),
      {
        auditUser: "test"
      }
    );

    const request = requestWithUpdatedLetterContent();
    await editLetterContent(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.LETTER_DOES_NOT_EXIST)
    );
  });

  const requestWithUpdatedLetterContent = () => {
    return httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: c4se.id },
      body: { editedLetterHtml: newEditedLetterHtml },
      nickname: "nickname"
    });
  };
});
