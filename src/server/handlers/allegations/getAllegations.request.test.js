import models from "../../models";
import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../requestTestHelpers";

describe("GET /allegations", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should retrieve allegation from database", async () => {
    const allegation1 = {
      rule: "rule1",
      paragraph: "paragraph1"
    };

    const allegation2 = {
      rule: "rule1",
      paragraph: "paragraph2"
    };

    const allegation3 = {
      rule: "rule2",
      paragraph: "paragraph3"
    };

    const allegation4 = {
      rule: "rule2",
      paragraph: "paragraph3"
    };

    const expectedResponse = [
      { rule: "rule1", paragraphs: ["paragraph1", "paragraph2"] },
      { rule: "rule2", paragraphs: ["paragraph3"] }
    ];

    await models.allegation.bulkCreate([
      allegation1,
      allegation2,
      allegation3,
      allegation4
    ]);

    await request(app)
      .get("/api/allegations")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expect.arrayContaining(expectedResponse));
      });
  });
});
