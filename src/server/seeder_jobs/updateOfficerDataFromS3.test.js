import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../testHelpers/requestTestHelpers";
import models from "../models";
import fs from "fs";
import path from "path";
import updateOfficerDataFromS3 from "./updateOfficerDataFromS3";
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
      await updateOfficerDataFromS3();

      const newOfficerMaggie = await models.officer.find({
        where: { firstName: "Maggie" }
      });
      const updatedOfficerChris = await models.officer.find({
        where: { firstName: "Chris" }
      });
      const unchangedOfficerKristin = await models.officer.find({
        where: { firstName: "Kirstin" }
      });

      expect(updatedOfficerChris.lastName).not.toEqual("Paucek");
      expect(newOfficerMaggie).not.toEqual(null);
      expect(unchangedOfficerKristin.updatedAt).toEqual(
        unchangedOfficerKristin.createdAt
      );
    })
  );
});
