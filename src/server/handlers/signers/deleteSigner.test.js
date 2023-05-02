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
import deleteSigner from "./deleteSigner";

const httpMocks = require("node-mocks-http");
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

describe("deleteSigner", () => {
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

  test("should delete the signer if signer and file exist", async () => {
    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`
      },
      params: {
        id: 1
      },
      nickname: "bob@bobby.bob",
      permissions: USER_PERMISSIONS.ADMIN_ACCESS
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await deleteSigner(request, response, next);

    const found = await models.signers.findAll({ where: { name: "Robert" } });
    expect(found).toHaveLength(0);
  });
});
