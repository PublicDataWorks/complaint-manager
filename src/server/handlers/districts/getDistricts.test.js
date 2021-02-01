import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../policeDataManager/models";
import request from "supertest";

describe("getDistricts", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns a list of districts to populate dropdown", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const secondDistrict = await models.district.create({
      name: "2nd District"
    });
    const firstDistrict = await models.district.create({
      name: "1st District"
    });
    const hundredthDistrict = await models.district.create({
      name: "100th District"
    });
    const thirdDistrict = await models.district.create({
      name: "3rd District"
    });
    const tenthDistrict = await models.district.create({
      name: "10th District"
    });

    const expectedOrderedDistricts = [
      [firstDistrict.name, firstDistrict.id],
      [secondDistrict.name, secondDistrict.id],
      [thirdDistrict.name, thirdDistrict.id],
      [tenthDistrict.name, tenthDistrict.id],
      [hundredthDistrict.name, hundredthDistrict.id]
    ];

    const responsePromise = request(app)
      .get("/api/districts")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedOrderedDistricts);
  });
});
