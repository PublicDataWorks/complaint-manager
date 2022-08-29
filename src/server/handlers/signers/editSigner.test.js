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

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

AWS.S3.mockImplementation(() => ({
  config: {
    loadFromPath: jest.fn(),
    update: jest.fn()
  },
  deleteObject: jest.fn(),
  listObjectsV2: (params, callback) =>
    callback(undefined, {
      Contents: [
        {
          ETag: '"987asd6f9iuashdlkjhdf"',
          Key: "signatures/john_a_simms.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6f9iuas23lkjhdf"',
          Key: "signatures/nina_ambroise.png",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        },
        {
          ETag: '"987asd6jj3uashdlkjhdf"',
          Key: "signatures/bobby.gif",
          LastModified: new Date(),
          Size: 11,
          StorageClass: "STANDARD"
        }
      ],
      IsTruncated: true,
      KeyCount: 3,
      MaxKeys: 3
    })
}));

describe("editSigner", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let token, signer;
  beforeEach(async () => {
    token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    signer = await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withId(1)
        .withName("Robert")
        .withPhone("777-333-8888")
        .withNickname("bob@bobby.bob"),
      { auditUser: "user" }
    );
  });

  test("should update the signer if signer and file exist", async () => {
    const responsePromise = request(app)
      .put("/api/signers/1")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "3322392485",
        signatureFile: "bobby.gif"
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
          expect.objectContaining({ rel: "delete", method: "delete" })
        ]
      })
    );

    const found = await models.signers.findAll({ where: { name: "Bobby" } });
    expect(found).toHaveLength(1);
    expect(found[0].phone).toEqual("332-239-2485");
  });

  test("should update the signer if signer and file exist", async () => {
    const responsePromise = request(app)
      .put("/api/signers/1")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "3322392485"
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
          expect.objectContaining({ rel: "delete", method: "delete" })
        ]
      })
    );

    const found = await models.signers.findAll({ where: { name: "Bobby" } });
    expect(found).toHaveLength(1);
    expect(found[0].phone).toEqual("332-239-2485");
    expect(found[0].signatureFile).toEqual(signer.signatureFile);
  });

  test("should return a 400 if signature file does not exist", async () => {
    const responsePromise = request(app)
      .put("/api/signers/1")
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

  test("should return a 404 if the signer doesn't exist", async () => {
    const responsePromise = request(app)
      .put("/api/signers/8773")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bobby",
        title: "Chiefest Bobby",
        nickname: "bob@bobby.bob",
        phone: "332-239-2485",
        signatureFile: "bobby.gif"
      });

    await expectResponse(responsePromise, 404);
  });
});
