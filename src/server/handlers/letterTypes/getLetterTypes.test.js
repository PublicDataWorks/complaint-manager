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
    status = models.caseStatus.create(
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

    await models.letter_types.create(
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
        hasEditPage: null,
        requiresApproval: null,
        requiredStatus: null,
        defaultSender: expect.objectContaining({
          id: 1,
          name: "John A Simms",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          signatureFile: "bobby.png",
          title: "Independent Police Monitor"
        })
      }
    ]);
  });
});
