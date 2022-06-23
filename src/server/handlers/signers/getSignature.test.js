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

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

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

    AWS.S3.mockImplementation(() => ({
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      getObject: jest.fn((opts, callback) =>
        callback(undefined, {
          ContentType: "image/png",
          Body: Buffer.from("bytesbytesbytes", "base64")
        })
      )
    }));
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
});
