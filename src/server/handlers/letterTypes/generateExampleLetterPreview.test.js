import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import { seedLetterSettings } from "../../testHelpers/testSeeding";
import LetterType from "../../../sharedTestHelpers/letterType";
import LetterImage from "../../../sharedTestHelpers/LetterImage";
import LetterTypeLetterImage from "../../../sharedTestHelpers/LetterTypeLetterImage";
import Signer from "../../../sharedTestHelpers/signer";

describe("generateExampleLetterPreview", () => {
  jest.setTimeout(50000);
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await seedLetterSettings();
  });

  test("generates example letter from template", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .post("/api/example-letter-preview")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template: "<section>{{caseReference}}</section>"
      });

    await expectResponse(responsePromise, 200);
  });

  test("if body template is sent, that text is generated first and interpolated as letterBody", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .post("/api/example-letter-preview")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template:
          "<div><section>{{caseReference}}</section>{{letterBody}}</div>",
        bodyTemplate: "Hi, I'm a body"
      });

    await expectResponse(responsePromise, 200);
  });

  describe("with images", () => {
    let type;
    beforeEach(async () => {
      let signer = await models.signers.create(
        new Signer.Builder().defaultSigner().build(),
        { auditUser: "user" }
      );
      type = await models.letter_types.create(
        new LetterType.Builder()
          .defaultLetterType()
          .withDefaultSender(signer)
          .build(),
        { auditUser: "user" }
      );
      let image = await models.letterImage.create(
        new LetterImage.Builder().defaultLetterImage().build(),
        { auditUser: "user" }
      );
      await models.letterTypeLetterImage.create(
        new LetterTypeLetterImage.Builder()
          .defaultLetterTypeLetterImage()
          .withLetterId(type.id)
          .withImageId(image.id)
          .build(),
        { auditUser: "user" }
      );
    });

    test("if type is sent, only images for that type are used", async () => {
      const token = buildTokenWithPermissions("", "nickname");
      const responsePromise = request(app)
        .post("/api/example-letter-preview")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          template: "<section>{{caseReference}}</section>",
          type: type.name
        });

      await expectResponse(responsePromise, 200);
    });

    test("if type is not sent, all images are used", async () => {
      const token = buildTokenWithPermissions("", "nickname");
      const responsePromise = request(app)
        .post("/api/example-letter-preview")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          template: "<section>{{caseReference}}</section>"
        });

      await expectResponse(responsePromise, 200);
    });
  });
});
