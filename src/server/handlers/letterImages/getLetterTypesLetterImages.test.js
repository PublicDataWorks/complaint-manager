import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import LetterType from "../../../sharedTestHelpers/letterType";
import Signer from "../../../sharedTestHelpers/signer";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

describe("getLetterImages", () => {
  beforeEach(async () => {
    await cleanupDatabase();

    await models.letterImage.create(
      { id: 1, image: "header_text.png" },
      { auditUser: "user" }
    );

    await models.letterImage.create(
      { id: 2, image: "icon.png" },
      { auditUser: "user" }
    );

    const signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      {
        auditUser: "user"
      }
    );

    const caseStatus = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withDefaultSender(signer)
        .withRequiredStatus(caseStatus)
        .build(),
      { auditUser: "user" }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(2)
        .withType("complainant")
        .withDefaultSender(signer)
        .withRequiredStatus(caseStatus)
        .build(),
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      {
        id: 1,
        imageId: 1,
        letterId: 1,
        maxWidth: "450px",
        name: "large icon"
      },
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      {
        id: 2,
        imageId: 2,
        letterId: 1,
        maxWidth: "60px",
        name: "small icon"
      },
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      {
        id: 3,
        imageId: 1,
        letterId: 2,
        maxWidth: "450px",
        name: "large icon"
      },
      { auditUser: "user" }
    );

    await models.letterTypeLetterImage.create(
      {
        id: 4,
        imageId: 2,
        letterId: 2,
        maxWidth: "60px",
        name: "small icon"
      },
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should retrieve letter images", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .get("/api/letter-types-letter-images")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, [
      { id: 1, imageId: 1, letterId: 1, maxWidth: "450px", name: "large icon" },
      { id: 2, imageId: 2, letterId: 1, maxWidth: "60px", name: "small icon" },
      { id: 3, imageId: 1, letterId: 2, maxWidth: "450px", name: "large icon" },
      { id: 4, imageId: 2, letterId: 2, maxWidth: "60px", name: "small icon" }
    ]);
  });
});
