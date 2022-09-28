import models from "../../policeDataManager/models";
import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";

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

describe("GET /allegations", function () {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
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

    const responsePromise = request(app)
      .get("/api/allegations")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining(expectedResponse)
    );
  });

  test("rule should be sorted in ascending order", async () => {
    const allegation1 = {
      rule: "rule2"
    };

    const allegation2 = {
      rule: "rule1"
    };

    const allegation3 = {
      rule: "rule3"
    };

    const expectedResponse = [
      { rule: "rule1", paragraphs: [null] },
      { rule: "rule2", paragraphs: [null] },
      { rule: "rule3", paragraphs: [null] }
    ];

    await models.allegation.bulkCreate([allegation1, allegation2, allegation3]);

    const responsePromise = request(app)
      .get("/api/allegations")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponse);
  });

  test("rule and paragraph should be sorted in ascending order", async () => {
    const allegation1 = {
      rule: "rule2",
      paragraph: "paragraph1"
    };

    const allegation2 = {
      rule: "rule1",
      paragraph: "paragraph2"
    };

    const allegation3 = {
      rule: "rule1",
      paragraph: "paragraph1"
    };

    const expectedResponse = [
      { rule: "rule1", paragraphs: ["paragraph1", "paragraph2"] },
      { rule: "rule2", paragraphs: ["paragraph1"] }
    ];

    await models.allegation.bulkCreate([allegation1, allegation2, allegation3]);

    const responsePromise = request(app)
      .get("/api/allegations")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponse);
  });
});
