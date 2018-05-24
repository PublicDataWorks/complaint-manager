import Allegation from "../../../client/testUtilities/Allegation";
import models from "../../models";
import request from "supertest";
import app from "../../server";
import buildTokenWithPermissions from "../../requestTestHelpers";

afterEach(async () => {
  await models.allegation.destroy({ truncate: true, cascade: true });
});

test("should return an allegation", async () => {
  const allegation = new Allegation.Builder()
    .defaultAllegation()
    .withId(undefined)
    .build();

  const createdAllegation = await models.allegation.create(allegation);

  const token = buildTokenWithPermissions("", "TEST_NICKNAME");

  await request(app)
    .get("/api/allegations/search")
    .set("Authorization", `Bearer ${token}`)
    .query({ rule: createdAllegation.rule })
    .expect(200)
    .then(response => {
      expect(response.body.length).toEqual(1);
      expect(response.body[0].rule).toEqual(createdAllegation.rule);
    });
});
