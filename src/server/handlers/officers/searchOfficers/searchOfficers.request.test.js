import models from "../../../policeDataManager/models/index";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../sharedTestHelpers/Officer";

jest.mock(
  "../../../getFeaturesAsync",
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

describe("GET /officers/search", () => {
  let token;
  beforeEach(async () => {
    await cleanupDatabase();
    token = buildTokenWithPermissions("", "tuser");
    await models.district.create({
      id: 1,
      name: "1st District"
    });
    await models.district.create({
      id: 8,
      name: "8th District"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("match single attribute", () => {
    let bobOfficer, garretOfficer, grantOfficer;
    beforeEach(async () => {
      bobOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123)
        .withFirstName("Bob")
        .withLastName("Ferguson")
        .build();

      garretOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(345)
        .withFirstName("Garret")
        .withLastName("Fisher")
        .withDistrict("1st District")
        .withDistrictId(1)
        .build();

      grantOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(567)
        .withFirstName("Grant")
        .withLastName("Livingston")
        .withDistrict("8th District")
        .withDistrictId(8)
        .build();

      await models.officer.bulkCreate(
        [bobOfficer, garretOfficer, grantOfficer],
        {
          returning: true
        }
      );
    });
    test("returns officer that partially matches first name", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "bo" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: bobOfficer.firstName,
              middleName: bobOfficer.middleName,
              lastName: bobOfficer.lastName,
              fullName: `${bobOfficer.firstName} ${bobOfficer.middleName} ${bobOfficer.lastName}`
            })
          ]
        })
      );
    });

    test("returns officer that partially matches last name", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ lastName: "fi" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: garretOfficer.firstName,
              lastName: garretOfficer.lastName
            })
          ]
        })
      );
    });

    test("returns officer that matches district", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ districtId: 8 });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: grantOfficer.firstName,
              lastName: grantOfficer.lastName
            })
          ]
        })
      );
    });
  });

  describe("match multiple attributes", () => {
    let garretOfficer, gaaOfficer, garyOfficer;

    beforeEach(async () => {
      garretOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123)
        .withFirstName("Garret")
        .withLastName("Fisher")
        .withDistrict("1st District")
        .withDistrictId(1)
        .build();

      garyOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(321)
        .withFirstName("Gary")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
        .withDistrictId(8)
        .build();

      gaaOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(231)
        .withFirstName("Gaaaa")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
        .withDistrictId(8)
        .build();

      await models.officer.bulkCreate(
        [garretOfficer, garyOfficer, gaaOfficer],
        {
          returning: true
        }
      );
    });

    test("returns officer that matches first name, last name, and district", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Gar", lastName: "fi", districtId: 1 });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: garretOfficer.firstName,
              lastName: garretOfficer.lastName
            })
          ]
        })
      );
    });

    test("returns multiple officers that matches first name, last name, sorting by last name first name", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Ga", lastName: "fi" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: gaaOfficer.firstName,
              lastName: gaaOfficer.lastName
            }),
            expect.objectContaining({
              firstName: garyOfficer.firstName,
              lastName: garyOfficer.lastName
            }),
            expect.objectContaining({
              firstName: garretOfficer.firstName,
              lastName: garretOfficer.lastName
            })
          ]
        })
      );
    });
  });

  describe("officers with different created_at dates exist", () => {
    let henryOfficerCreatedJan, henryOfficerCreatedDec;
    process.env.OFFICER_ROSTER_LATEST_DATE = 1704568927;

    beforeEach(async () => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date(2024, 1, 10));

      henryOfficerCreatedJan = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123)
        .withFirstName("Henry")
        .withLastName("Fisher")
        .withDistrict("1st District")
        .withDistrictId(1)
        .build();
      henryOfficerCreatedDec = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(321)
        .withFirstName("Henry")
        .withLastName("Fisher")
        .withDistrict("1st District")
        .withDistrictId(1)
        .build();

      await models.officer.bulkCreate(
        [
          {
            ...henryOfficerCreatedJan,
            createdAt: "2024-01-10 00:00:00.000 -0800"
          },
          {
            ...henryOfficerCreatedDec,
            createdAt: "2023-12-30 00:00:00.000 -0800"
          }
        ],
        {
          returning: true
        }
      );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("matches only officer created after OFFICER_ROSTER_LATEST_DATE", async () => {
      const responsePromise = request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "h" });

      const response = await responsePromise;

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: expect.arrayContaining([
            expect.objectContaining({
              createdAt: "2024-01-10T08:00:00.000Z"
            })
          ])
        })
      );
      expect(response.body.rows).toHaveLength(1);
    });

    test("should return an error when OFFICER_ROSTER_LATEST_DATE is not valid", async () => {
      process.env.OFFICER_ROSTER_LATEST_DATE = "not-valid-format";
      const response = await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "h" });

      expect(response.statusCode).toEqual(500);
    });
  });
});
