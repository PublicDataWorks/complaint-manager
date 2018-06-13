import models from "../../models";
import app from "../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../requestTestHelpers";
import Officer from "../../../client/testUtilities/Officer";

describe("GET /officers/search", () => {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("match single attribute", () => {
    let bobOfficer, seededOfficers;

    beforeEach(async () => {
      bobOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123)
        .withFirstName("Bob")
        .withLastName("Ferguson")
        .build();

      const garretOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(345)
        .withFirstName("Garret")
        .withLastName("Fisher")
        .withDistrict("First District")
        .build();

      const grantOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(567)
        .withFirstName("Grant")
        .withLastName("Livingston")
        .withDistrict("Eighth District")
        .build();

      seededOfficers = await models.officer.bulkCreate(
        [bobOfficer, garretOfficer, grantOfficer],
        {
          returning: true
        }
      );
    });

    test("returns officer that partially matches first name", async () => {
      await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "bo" })
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);
          expect(response.body[0].firstName).toEqual(bobOfficer.firstName);
          expect(response.body[0].middleName).toEqual(bobOfficer.middleName);
          expect(response.body[0].lastName).toEqual(bobOfficer.lastName);
          expect(response.body[0].fullName).toEqual(
            `${bobOfficer.firstName} ${bobOfficer.middleName} ${
              bobOfficer.lastName
            }`
          );
        });
    });

    test("returns officer that partially matches last name", async () => {
      await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ lastName: "fi" })
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);
          expect(response.body[0].firstName).toEqual("Garret");
          expect(response.body[0].lastName).toEqual("Fisher");
        });
    });

    test("returns officer that matches district", async () => {
      await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ district: "Eighth District" })
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);
          expect(response.body[0].firstName).toEqual("Grant");
          expect(response.body[0].lastName).toEqual("Livingston");
        });
    });
  });

  describe("match multiple attributes", () => {
    let seededOfficers;

    beforeEach(async () => {
      const garretOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123)
        .withFirstName("Garret")
        .withLastName("Fisher")
        .withDistrict("1st District")
        .build();

      const garyOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(321)
        .withFirstName("Gary")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
        .build();

      const gaaOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(231)
        .withFirstName("Gaaaa")
        .withLastName("Fibbleton")
        .withDistrict("8th District")
        .build();

      seededOfficers = await models.officer.bulkCreate(
        [garretOfficer, garyOfficer, gaaOfficer],
        {
          returning: true
        }
      );
    });

    test("returns officer that matches first name, last name, and district", async () => {
      await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Gar", lastName: "fi", district: "1st District" })
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);
          expect(response.body[0].firstName).toEqual("Garret");
          expect(response.body[0].lastName).toEqual("Fisher");
        });
    });

    test("returns multiple officers that matches first name, last name, sorting by last name first name", async () => {
      await request(app)
        .get("/api/officers/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Ga", lastName: "fi" })
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(3);
          expect(response.body[0].firstName).toEqual("Gaaaa");
          expect(response.body[0].lastName).toEqual("Fibbleton");
          expect(response.body[1].firstName).toEqual("Gary");
          expect(response.body[1].lastName).toEqual("Fibbleton");
          expect(response.body[2].firstName).toEqual("Garret");
          expect(response.body[2].lastName).toEqual("Fisher");
        });
    });
  });
});
