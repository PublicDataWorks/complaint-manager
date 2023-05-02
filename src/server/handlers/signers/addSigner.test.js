import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import Signer from "../../../sharedTestHelpers/signer";

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

describe("addSigner", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
  });

  test("should create a signer if file exists", async () => {
    const responsePromise = request(app)
      .post("/api/signers")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "3322392485",
        signatureFile: "nina_ambroise.png"
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "332-239-2485",
        links: [
          expect.objectContaining({
            rel: "signature"
          }),
          expect.objectContaining({
            rel: "delete",
            method: "delete"
          })
        ]
      })
    );

    const found = await models.signers.findAll({ where: { name: "Bobby" } });
    expect(found).toHaveLength(1);
  });

  test("should return a 400 if signature file does not exist", async () => {
    const responsePromise = request(app)
      .post("/api/signers")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "332-239-2485",
        signatureFile: "not-bobby.gif"
      });

    await expectResponse(responsePromise, 400);
  });

  test("should return a 400 if requested username already has a signer", async () => {
    await models.signers.create(
      new Signer.Builder().defaultSigner().withNickname("bob@bobby.bob").build()
    );

    const responsePromise = request(app)
      .post("/api/signers")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "332-239-2485",
        signatureFile: "nina_ambroise.png"
      });

    await expectResponse(responsePromise, 400);
  });
});
