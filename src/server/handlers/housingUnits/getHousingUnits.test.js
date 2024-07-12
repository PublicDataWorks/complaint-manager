import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../server";
import models from "../../policeDataManager/models";
import { first } from "lodash";

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

describe("getHousingUnits", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it should return 200", async () => {
    const token = buildTokenWithPermissions("", "user");

    const firstFacility = await models.facility.create({
      name: "facility 1",
      abbreviation: "F1"
    });

    const secondFacility = await models.facility.create({
      name: "facility 2",
      abbreviation: "F2"
    });

    await models.housing_unit.create(
      { name: "housing unit 1", facilityId: firstFacility.id },
      { auditUser: "user" }
    );

    await models.housing_unit.create(
      { name: "housing unit 2", facilityId: secondFacility.id },
      { auditUser: "user" }
    );

    const responsePromise = request(app)
      .get(`/api/facilities/${firstFacility.id}/housing-units`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    await expectResponse(responsePromise, 200, [
      expect.objectContaining({ name: "housing unit 1" })
    ]);
  });
});
