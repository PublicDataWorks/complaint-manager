import models from "../../policeDataManager/models/index";
import app from "../../server";
import request from "supertest";
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

describe("GET /facilities", () => {
  let token, facility1, facility2;
  beforeEach(async () => {
    await cleanupDatabase();
    token = buildTokenWithPermissions("", "tuser");

    facility1 = await models.facility.create(
      {
        abbreviation: "ABC",
        name: "Alpha Betting Company"
      },
      { auditUser: "user" }
    );

    facility2 = await models.facility.create(
      {
        abbreviation: "TVA",
        name: "Tennessee Valley Authority"
      },
      { auditUser: "user" }
    );

    await models.housing_unit.create(
      {
        name: "ABC-HU-1",
        facilityId: facility1.id
      },
      { auditUser: "user" }
    );

    await models.housing_unit.create(
      {
        name: "ABC-HU-2",
        facilityId: facility1.id
      },
      { auditUser: "user" }
    );

    await models.housing_unit.create(
      {
        name: "TVA-HU-1",
        facilityId: facility2.id
      },
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns facilities", async () => {
    const responsePromise = request(app)
      .get("/api/facilities")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        expect.objectContaining({
          id: facility1.id,
          name: facility1.name,
          abbreviation: facility1.abbreviation
        }),
        expect.objectContaining({
          id: facility2.id,
          name: facility2.name,
          abbreviation: facility2.abbreviation
        })
      ])
    );
  });

  test("returns 400 status when invalid expand param is passed", async () => {
    const responsePromise = request(app)
      .get("/api/facilities?expand=invalid")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 400);
  });

  test("returns inmate that partially matches first name", async () => {
    const responsePromise = request(app)
      .get("/api/facilities?expand=housingUnits")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        expect.objectContaining({
          id: facility1.id,
          name: facility1.name,
          abbreviation: facility1.abbreviation,
          housingUnits: expect.arrayContaining([
            expect.objectContaining({
              name: "ABC-HU-1"
            }),
            expect.objectContaining({
              name: "ABC-HU-2"
            })
          ])
        }),
        expect.objectContaining({
          id: facility2.id,
          name: facility2.name,
          abbreviation: facility2.abbreviation,
          housingUnits: expect.arrayContaining([
            expect.objectContaining({
              name: "TVA-HU-1"
            })
          ])
        })
      ])
    );
  });
});
