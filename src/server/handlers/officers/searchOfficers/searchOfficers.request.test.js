import models from "../../../models/index";
import app from "../../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../client/testUtilities/Officer";

jest.mock("../../cases/export/jobQueue");

describe("GET /officers/search", () => {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
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
        .withDistrict("First District")
        .build();

      grantOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(567)
        .withFirstName("Grant")
        .withLastName("Livingston")
        .withDistrict("Eighth District")
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
              fullName: `${bobOfficer.firstName} ${bobOfficer.middleName} ${
                bobOfficer.lastName
              }`
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
        .query({ district: "Eighth District" });

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
        .build();

      garyOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(321)
        .withFirstName("Gary")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
        .build();

      gaaOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(231)
        .withFirstName("Gaaaa")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
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
        .query({ firstName: "Gar", lastName: "fi", district: "1st District" });

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
});
