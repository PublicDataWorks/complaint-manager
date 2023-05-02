import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import Signer from "../../../sharedTestHelpers/signer";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

jest.mock("../../createConfiguredS3Instance");

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

describe("getSignature", () => {
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
        .withSignatureFile("jsimms.png")
        .build(),
      {
        auditUser: "user"
      }
    );
  });

  test("returns signature when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/api/signers/1/signature")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200);
  });

  test("throws not found error when signer does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/api/signers/2/signature")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 404);
  });
});
