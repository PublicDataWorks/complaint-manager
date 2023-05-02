import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../testHelpers/requestTestHelpers";
import models from "../policeDataManager/models";
import fs from "fs";
import path from "path";
import updateSeedOfficerDataFromS3 from "./updateSeedOfficerDataFromS3";
import loadCsv from "./loadCsv";

const testOfficerCsvPath = path.join(__dirname, "testOfficers2.csv");

const mockS3 = {
  getObject: jest.fn(async () => ({
    Body: fs.createReadStream(testOfficerCsvPath)
  }))
};
jest.mock("../createConfiguredS3Instance", () => jest.fn(() => mockS3));

describe("updating database using csv file in S3", () => {
  beforeEach(async () => {
    await models.district.create({
      id: 1,
      name: "1st District"
    });
    await loadCsv("testOfficers.csv", models.officer);
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
      await updateSeedOfficerDataFromS3();

      const newOfficerMaggie = await models.officer.findOne({
        where: { firstName: "Maggie" },
        include: [{ model: models.district, as: "officerDistrict" }]
      });
      const updatedOfficerChris = await models.officer.findOne({
        where: { firstName: "Chris" },
        include: [{ model: models.district, as: "officerDistrict" }]
      });
      const unchangedOfficerKristin = await models.officer.findOne({
        where: { firstName: "Kirstin" },
        include: [{ model: models.district, as: "officerDistrict" }]
      });

      expect(updatedOfficerChris.officerDistrict.name).toEqual("1st District");
      expect(updatedOfficerChris.districtId).toEqual(1);
      expect(updatedOfficerChris.dob).toEqual("1987-04-12");
      expect(updatedOfficerChris.lastName).not.toEqual("Paucek");
      expect(newOfficerMaggie).not.toEqual(null);
      expect(newOfficerMaggie.dob).toEqual(null);
      expect(newOfficerMaggie.officerDistrict.name).toEqual("1st District");
      expect(newOfficerMaggie.districtId).toEqual(1);
      expect(unchangedOfficerKristin.updatedAt).toEqual(
        unchangedOfficerKristin.createdAt
      );
      expect(unchangedOfficerKristin.dob).toEqual(null);
    })
  );
});
