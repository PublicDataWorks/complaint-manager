import Boom from "boom";
import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Letter from "../../../../sharedTestHelpers/Letter";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";
import editLetterAddresses from "./editLetterAddresses";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";

describe("editLetterAddresses", () => {
  let c4se, letter, response, next;

  beforeEach(async () => {
    await cleanupDatabase();
    response = httpMocks.createResponse();
    next = jest.fn();

    let signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      { auditUser: "test user" }
    );

    let letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("TEST LETTER TYPE")
        .withDefaultSender(signer)
        .build(),
      { auditUser: "test user" }
    );

    let caseStatus = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "test user" }
    );

    c4se = await models.cases.create(
      new Case.Builder().defaultCase().withId(1).withStatus(caseStatus).build(),
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

  test("should update existing letter addresses", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: c4se.id, letterId: letter.id },
      body: {
        recipient: "Arthur Conan Doyle",
        recipientAddress: "123 Missing Link Road",
        sender: "Sally McSally",
        transcribedBy: "John Watson"
      },
      nickname: "nickname",
      permissions: [USER_PERMISSIONS.SETUP_LETTER]
    });

    await editLetterAddresses(request, response, next);
    await letter.reload();

    expect(letter.recipient).toEqual("Arthur Conan Doyle");
    expect(letter.recipientAddress).toEqual("123 Missing Link Road");
    expect(letter.sender).toEqual("Sally McSally");
    expect(letter.transcribedBy).toEqual("John Watson");
  });

  test("should return a 404 if the letter with the given id does not exist", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: c4se.id, letterId: letter.id + 1 },
      body: {
        recipient: "Arthur Conan Doyle",
        recipientAddress: "123 Missing Link Road",
        sender: "Sally McSally",
        transcribedBy: "John Watson"
      },
      nickname: "nickname",
      permissions: [USER_PERMISSIONS.SETUP_LETTER]
    });

    await editLetterAddresses(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND)
    );
  });

  test("should return a 404 if the letter with the given id does not belong to the given case", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: c4se.id + 1, letterId: letter.id },
      body: {
        recipient: "Arthur Conan Doyle",
        recipientAddress: "123 Missing Link Road",
        sender: "Sally McSally",
        transcribedBy: "John Watson"
      },
      nickname: "nickname"
    });

    await editLetterAddresses(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND)
    );
  });
});
