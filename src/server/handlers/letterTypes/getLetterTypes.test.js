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

describe("getLetterTypes", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
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
        .withEditableTemplate("")
        .withDefaultSenderId(1)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(2)
        .withType("COMPLAINANT")
        .withEditableTemplate("editable template")
        .withDefaultSenderId(1)
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
        editableTemplate: "",
        hasEditPage: null,
        requiresApproval: null
      },
      {
        id: 2,
        type: "COMPLAINANT",
        template: "",
        editableTemplate: "editable template",
        hasEditPage: null,
        requiresApproval: null
      }
    ]);
  });
});
