import models from "../../policeDataManager/models/index";
import app from "../../server";
import request from "supertest";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import Inmate from "../../../sharedTestHelpers/Inmate";

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

describe("GET /inmates/search", () => {
  let token;
  beforeEach(async () => {
    await cleanupDatabase();
    token = buildTokenWithPermissions("", "tuser");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("match single attribute", () => {
    let bobInmate, garretInmate, grantInmate;
    beforeEach(async () => {
      bobInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("123")
        .withFirstName("Bob")
        .withLastName("Ferguson")
        .build();

      garretInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("A1299")
        .withFirstName("Garret")
        .withLastName("Fisher")
        .build();

      grantInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("A09383")
        .withFirstName("Grant")
        .withLastName("Livingston")
        .build();

      await models.inmate.bulkCreate([bobInmate, garretInmate, grantInmate], {
        returning: true
      });
    });

    test("returns inmate that partially matches first name", async () => {
      const responsePromise = request(app)
        .get("/api/inmates/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "bo" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: bobInmate.firstName,
              lastName: bobInmate.lastName,
              fullName: `${bobInmate.firstName} ${bobInmate.lastName}`
            })
          ]
        })
      );
    });

    test("returns inmate that partially matches last name", async () => {
      const responsePromise = request(app)
        .get("/api/inmates/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ lastName: "fi" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: garretInmate.firstName,
              lastName: garretInmate.lastName
            })
          ]
        })
      );
    });

    test("returns inmate that matches id", async () => {
      const responsePromise = request(app)
        .get("/api/inmates/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ inmateId: "A1299" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: garretInmate.firstName,
              lastName: garretInmate.lastName
            })
          ]
        })
      );
    });
  });

  describe("match multiple attributes", () => {
    let garretInmate, gaaInmate, garyInmate;

    beforeEach(async () => {
      garretInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("123")
        .withFirstName("Garret")
        .withLastName("Fisher")
        .build();

      garyInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("321")
        .withFirstName("Gary")
        .withLastName("Fibbleton")
        .build();

      gaaInmate = new Inmate.Builder()
        .defaultInmate()
        .withInmateId("231")
        .withFirstName("Gaaaa")
        .withLastName("Fibbleton")
        .build();

      await models.inmate.bulkCreate([garretInmate, garyInmate, gaaInmate], {
        returning: true
      });
    });

    test("returns inmate that matches first name, last name, and id", async () => {
      const responsePromise = request(app)
        .get("/api/inmates/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Gar", lastName: "fi", inmateId: 2 });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: garyInmate.firstName,
              lastName: garyInmate.lastName
            }),
            expect.objectContaining({
              firstName: garretInmate.firstName,
              lastName: garretInmate.lastName
            })
          ]
        })
      );
    });

    test("returns multiple inmates that matches first name, last name, sorting by last name first name", async () => {
      const responsePromise = request(app)
        .get("/api/inmates/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ firstName: "Ga", lastName: "fi" });

      await expectResponse(
        responsePromise,
        200,
        expect.objectContaining({
          rows: [
            expect.objectContaining({
              firstName: gaaInmate.firstName,
              lastName: gaaInmate.lastName
            }),
            expect.objectContaining({
              firstName: garyInmate.firstName,
              lastName: garyInmate.lastName
            }),
            expect.objectContaining({
              firstName: garretInmate.firstName,
              lastName: garretInmate.lastName
            })
          ]
        })
      );
    });
  });
});
