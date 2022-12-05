import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import Signer from "../../../sharedTestHelpers/signer";
import LetterType from "../../../sharedTestHelpers/letterType";
import {
  RANK_INITIATED,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import LetterImage from "../../../sharedTestHelpers/LetterImage";
import LetterTypeLetterImage from "../../../sharedTestHelpers/LetterTypeLetterImage";

describe("deleteLetterType", () => {
  let status, letterType;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    status = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const signer = new Signer.Builder().defaultSigner().withId(1).build();

    await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withId(1)
        .withName("John A Simms")
        .withNickname("jsimms@oipm.gov")
        .withPhone("888-576-9922")
        .withTitle("Independent Police Monitor")
        .build(),
      {
        auditUser: "user"
      }
    );

    letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withRequiredStatus(status)
        .build(),
      {
        auditUser: "user"
      }
    );
  });

  test("deletes letter type if it exists", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .delete(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 204);
    expect(await models.letter_types.findByPk(letterType.id)).toBeFalsy();
  });

  test("also deletes letter-types-letter-images connected to the letter type if any exist", async () => {
    const letterImage = await models.letterImage.create(
      new LetterImage.Builder().defaultLetterImage().build(),
      { auditUser: "user" }
    );

    const letterTypeLetterImage = await models.letterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .withLetterId(letterType.id)
        .withImageId(letterImage.id)
        .build(),
      { auditUser: "user" }
    );

    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .delete(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 204);
    expect(await models.letter_types.findByPk(letterType.id)).toBeFalsy();
    expect(
      await models.letterTypeLetterImage.findByPk(letterTypeLetterImage.id)
    ).toBeFalsy();
  });

  test("should also delete complaint types if attached", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    await models.letterTypeComplaintType.create(
      {
        letterTypeId: letterType.id,
        complaintTypeId: RANK_INITIATED
      },
      { auditUser: "user" }
    );

    const responsePromise = request(app)
      .delete(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 204);
    expect(await models.letter_types.findByPk(letterType.id)).toBeFalsy();
    expect(
      await models.letterTypeComplaintType.findAll({
        where: { letterTypeId: letterType.id }
      })
    ).toHaveLength(0);
  });

  test("returns 404 if letter type does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .delete("/api/letter-types/223456")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 404);
  });
});
