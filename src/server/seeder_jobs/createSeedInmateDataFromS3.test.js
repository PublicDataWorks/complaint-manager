import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../testHelpers/requestTestHelpers";
import models from "../policeDataManager/models";
import fs from "fs";
import path from "path";
import createSeedInmateDataFromS3 from "./createSeedInmateDataFromS3";
import Inmate from "../../sharedTestHelpers/Inmate";
import createConfiguredS3Instance from "../createConfiguredS3Instance";

const testRosterCsvPath = path.join(__dirname, "testRoster.csv");

const mockS3 = {
  getObject: jest.fn(async () => ({
    Body: fs.createReadStream(testRosterCsvPath)
  }))
};
jest.mock("../createConfiguredS3Instance", () => jest.fn(() => mockS3));

describe("updating inmates table in database using csv file in S3", () => {
  jest.setTimeout(100000);
  beforeEach(async () => {
    await cleanupDatabase();
    await models.inmate.create(
      new Inmate.Builder()
        .defaultInmate()
        .withFirstName("Jayden")
        .withInmateId("A4015665")
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.inmate.create(
      new Inmate.Builder()
        .defaultInmate()
        .withFirstName("Amirah")
        .withLastName("Lennon")
        .withInmateId("A5834329")
        .withRegion("MAUI")
        .withFacility("OCCC")
        .withLocationSub1("INFIRMARY")
        .withLocationSub2(undefined)
        .withHousing("OCCC")
        .withCurrentLocation("MAUI")
        .withStatus("PROBATION")
        .withCustodyStatus("PAROLE VIOLATION")
        .withSecurityClassification("COMMUNITY")
        .withGender("MALE")
        .withPrimaryEthnicity("HAWAIIAN")
        .withRace("ASIAN or PACIFIC ISLANDER")
        .withMuster("MAUI")
        .withIndigent(true)
        .withClassificationDate("2022-04-23")
        .withBookingStartDate("2022-07-01")
        .withTentativeReleaseDate("2023-07-26")
        .withBookingEndDate("2023-08-15")
        .withActualReleaseDate("2023-08-15")
        .withWeekender(false)
        .withDateOfBirth("1986-06-18")
        .withAge(36)
        .withCountryOfBirth("USA")
        .withCitizenship("USA")
        .withLanguage("ENGLISH")
        .withSentenceLength("1 years, 1 months, 2 weeks, 1 days")
        .withOnCount(true)
        .build(),
      {
        auditUser: "user"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test(
    "handling update/insert on new data & not update on unchanged data",
    suppressWinstonLogs(async () => {
      await createSeedInmateDataFromS3();

      const newInmateJohn = await models.inmate.findOne({
        where: { firstName: "John" }
      });
      const updatedInmateJayden = await models.inmate.findOne({
        where: { firstName: "Jayden" }
      });
      const unchangedInmateAmirah = await models.inmate.findOne({
        where: { firstName: "Amirah" }
      });

      expect(updatedInmateJayden.lastName).toEqual("Snead");
      expect(updatedInmateJayden.dateOfBirth).toEqual("2003-01-02");
      expect(newInmateJohn).not.toEqual(null);
      expect(newInmateJohn.region).toEqual("OAHU");
      expect(newInmateJohn.dateOfBirth).toEqual("2007-03-09");
      expect(unchangedInmateAmirah.updatedAt).toEqual(
        unchangedInmateAmirah.createdAt
      );
      expect(unchangedInmateAmirah.dateOfBirth).toEqual("1986-06-18");
    })
  );
});
