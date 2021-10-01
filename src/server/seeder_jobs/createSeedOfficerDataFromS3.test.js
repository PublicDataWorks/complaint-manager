import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../testHelpers/requestTestHelpers";
import models from "../policeDataManager/models";
import fs from "fs";
import path from "path";
import createSeedOfficerDataFromS3 from "./createSeedOfficerDataFromS3";
import loadCsv from "./loadCsv";

const AWS = require("aws-sdk");

const testOfficerCsvPath = path.join(__dirname, "testOfficers2.csv");

jest.mock("aws-sdk", () => ({
  S3: jest.fn()
}));

describe("updating database using csv file in S3", () => {
  beforeEach(async () => {
    await loadCsv("testOfficers.csv", models.officer);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  AWS.S3.mockImplementation(() => ({
    getObject: () => ({
      createReadStream: () => fs.createReadStream(testOfficerCsvPath)
    }),
    config: {
      loadFromPath: jest.fn(),
      update: jest.fn()
    }
  }));

  test(
    "handling update/insert on new data & not update on unchanged data",
    suppressWinstonLogs(async () => {
      await createSeedOfficerDataFromS3();

      const newOfficerMaggie = await models.officer.findOne({
        where: { firstName: "Maggie" }
      });
      const updatedOfficerChris = await models.officer.findOne({
        where: { firstName: "Chris" }
      });
      const unchangedOfficerKristin = await models.officer.findOne({
        where: { firstName: "Kirstin" }
      });

      expect(updatedOfficerChris.lastName).not.toEqual("Paucek");
      expect(updatedOfficerChris.dob).toEqual("1987-04-12");
      expect(newOfficerMaggie).not.toEqual(null);
      expect(newOfficerMaggie.district).toEqual("First District");
      expect(newOfficerMaggie.dob).toEqual(null);
      expect(unchangedOfficerKristin.updatedAt).toEqual(
        unchangedOfficerKristin.createdAt
      );
      expect(unchangedOfficerKristin.dob).toEqual(null);
    })
  );
});
