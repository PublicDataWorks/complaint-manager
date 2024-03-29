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

    const letterImage = await models.letterImage.create(
      new LetterImage.Builder().defaultLetterImage().build(),
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

    let letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withDefaultRecipient("Dolli Fin")
        .withDefaultRecipientAddress("Ocean Surface Way")
        .withRequiredStatus(status)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.letterTypeLetterImage.create(
      new LetterTypeLetterImage.Builder()
        .defaultLetterTypeLetterImage()
        .withLetterId(letterType.id)
        .withImageId(letterImage.id)
        .build(),
      { auditUser: "user" }
    );
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
        complaintTypes: [],
        defaultSender: expect.objectContaining({
          id: 1,
          name: "John A Simms",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          signatureFile: "bobby.png",
          title: "Independent Police Monitor"
        }),
        defaultRecipient: "Dolli Fin",
        defaultRecipientAddress: "Ocean Surface Way",
        letterTypeLetterImage: expect.arrayContaining([
          {
            id: 1,
            letterId: 1,
            imageId: 1,
            maxWidth: "450px",
            name: "header"
          }
        ])
      }
    ]);
  });

  test("returns letter types with complaint types when letter is restricted to certain complaint types", async () => {
    const complaintType = await models.complaintTypes.create({
      name: RANK_INITIATED
    });

    await models.letterTypeComplaintType.create({
      letterTypeId: 1,
      complaintTypeId: complaintType.id
    });

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
        complaintTypes: [RANK_INITIATED],
        defaultSender: expect.objectContaining({
          id: 1,
          name: "John A Simms",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          signatureFile: "bobby.png",
          title: "Independent Police Monitor"
        }),
        defaultRecipient: "Dolli Fin",
        defaultRecipientAddress: "Ocean Surface Way",
        letterTypeLetterImage: expect.arrayContaining([
          {
            id: 1,
            letterId: 1,
            imageId: 1,
            maxWidth: "450px",
            name: "header"
          }
        ])
      }
    ]);
  });
});
