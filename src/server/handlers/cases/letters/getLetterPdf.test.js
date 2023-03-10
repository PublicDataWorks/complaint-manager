import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import models from "../../../policeDataManager/models";
import Signer from "../../../../sharedTestHelpers/signer";
import Letter from "../../../../sharedTestHelpers/Letter";
import LetterType from "../../../../sharedTestHelpers/letterType";
import app from "../../../server";
import request from "supertest";
import {
  seedStandardCaseStatuses,
  seedLetterSettings
} from "../../../testHelpers/testSeeding";

jest.mock(
  "../../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("Generate letter pdf", () => {
  jest.setTimeout(100000);
  let c4se, otherCase, letter, token, signer, statuses;

  beforeEach(async () => {
    await cleanupDatabase();

    token = buildTokenWithPermissions("", "nickname");
    statuses = await seedStandardCaseStatuses();

    c4se = await models.cases.create(
      new Case.Builder().defaultCase().withId(undefined).build(),
      { auditUser: "test user" }
    );

    otherCase = await models.cases.create(
      new Case.Builder().defaultCase().withId(undefined).build(),
      { auditUser: "test user" }
    );

    signer = await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withName("Nina Ambroise")
        .withTitle("Acting Police Monitor")
        .withSignatureFile("nina_ambroise.png")
        .build(),
      { auditUser: "test user" }
    );

    const letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withEditableTemplate("this is the editable template")
        .withType("TEST LETTER")
        .withTemplate("template")
        .withDefaultSender(signer)
        .withRequiredStatus(statuses[0])
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

    await seedLetterSettings();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return letter pdf blob", async () => {
    const responsePromise = request(app)
      .get(`/api/cases/${c4se.id}/letters/${letter.id}/pdf`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const response = await expectResponse(
      responsePromise,
      200,
      expect.any(Buffer)
    );

    expect(response.body.length > 0).toBeTruthy();
  });

  test("should return 404 if letter doesn't exist", async () => {
    const responsePromise = request(app)
      .get(`/api/cases/${c4se.id}/letters/${letter.id + 1}/pdf`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 404);
  });

  test("should return 404 if letter doesn't belong to given case", async () => {
    const responsePromise = request(app)
      .get(`/api/cases/${otherCase.id}/letters/${letter.id}/pdf`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 404);
  });
});
