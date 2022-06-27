import request from "supertest";
import app from "../server";
import {
  buildTokenWithPermissions,
  expectResponse
} from "../testHelpers/requestTestHelpers";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";
import models from "../policeDataManager/models";

describe("healthCheck", () => {
  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should pass in a working test environment", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.SETUP_LETTER,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/health-check")
      .set("Authorization", `Bearer ${token}`);
    await expectResponse(responsePromise, 200, { message: "Success" });
  });
});
