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
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

jest.mock(
  "../../getFeaturesAsync",
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

describe("getLetterTypes", () => {
  let status;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    status = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const letterImage = await models.letterImage.create({
      id: 1,
      image: "header.png"
    });

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

    let letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withRequiredStatus(status)
        .withLetterTypeLetterImage(1)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.letterTypeLetterImage.create({
      id: 1,
      letterId: letterType.id,
      imageId: letterImage.id,
      maxWidth: "460px",
      name: "header"
    });
  });

  test("returns letter types when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, [
      {
        id: 1,
        type: "REFERRAL",
        template: "",
        editableTemplate: null,
        hasEditPage: false,
        requiresApproval: false,
        requiredStatus: "Initial",
        defaultSender: expect.objectContaining({
          id: 1,
          name: "John A Simms",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          signatureFile: "bobby.png",
          title: "Independent Police Monitor"
        }),
        letterTypeLetterImage: expect.arrayContaining([
          {
            id: 1,
            letterId: 1,
            imageId: 1,
            maxWidth: "460px",
            name: "header"
          }
        ])
      }
    ]);
  });
});
