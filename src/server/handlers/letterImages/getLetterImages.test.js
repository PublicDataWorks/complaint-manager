import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";

describe("getLetterImages", () => {
  beforeEach(async () => {
    await models.letterImage.create(
      { id: 1, image: "header_text.png" },
      { auditUser: "user" }
    );

    await models.letterImage.create(
      { id: 2, image: "icon.png" },
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should retrieve letter images", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .get("/api/letter-images")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, [
      { id: 1, image: "header_text.png" },
      { id: 2, image: "icon.png" }
    ]);
  });
});
