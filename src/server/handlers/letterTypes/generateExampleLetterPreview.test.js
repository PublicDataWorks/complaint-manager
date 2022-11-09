import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";

describe("generateExampleLetterPreview", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  test("generates example letter from template", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .post("/api/example-letter-preview")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template: "<section>{{caseReference}}</section>"
      });

    await expectResponse(responsePromise, 200);
  });

  test("if body template is sent, that text is generated first and interpolated as letterBody", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .post("/api/example-letter-preview")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template:
          "<div><section>{{caseReference}}</section>{{letterBody}}</div>",
        bodyTemplate: "Hi, I'm a body"
      });

    await expectResponse(responsePromise, 200);
  });
});
