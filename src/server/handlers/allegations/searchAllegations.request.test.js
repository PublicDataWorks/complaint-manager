import Allegation from "../../../sharedTestHelpers/Allegation";
import models from "../../policeDataManager/models";
import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";

afterEach(async () => {
  await cleanupDatabase();
});

test("should return an allegation", async () => {
  const allegation = new Allegation.Builder()
    .defaultAllegation()
    .withId(undefined)
    .build();

  const createdAllegation = await models.allegation.create(allegation);

  const token = buildTokenWithPermissions("", "TEST_NICKNAME");

  const responsePromise = request(app)
    .get("/api/allegations/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ rule: createdAllegation.rule });

  await expectResponse(
    responsePromise,
    200,
    expect.objectContaining({
      rows: [expect.objectContaining({ rule: createdAllegation.rule })]
    })
  );
});

test("should include count in result", async () => {
  const allegation = new Allegation.Builder()
    .defaultAllegation()
    .withId(undefined)
    .build();
  const allegationTwo = new Allegation.Builder()
    .defaultAllegation()
    .withRule("my-rule")
    .build();

  await models.allegation.create(allegation);
  await models.allegation.create(allegationTwo);

  const token = buildTokenWithPermissions("", "TEST_NICKNAME");

  const responsePromise = request(app)
    .get("/api/allegations/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ limit: 1, offset: 1 });

  await expectResponse(
    responsePromise,
    200,
    expect.objectContaining({ count: 2 })
  );
});
