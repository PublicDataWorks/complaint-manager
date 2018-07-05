import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
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

  afterEach(async function() {
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

  test("should update existing officer when new data in S3 file", async () => {
    await updateOfficerDataFromS3();

    const updatedOfficer = await models.officer.find({
      where: { firstName: "Chris" }
    });

    expect(updatedOfficer.lastName).not.toEqual("Paucek");
  });

  test("should create new officer when new data in S3 file", async () => {
    await updateOfficerDataFromS3();

    const updatedOfficer = await models.officer.find({
      where: { firstName: "Maggie" }
    });

    expect(updatedOfficer).not.toEqual(null);
  });

  test("should not update if officer exists and is unchanged", async () => {
    await updateOfficerDataFromS3();

    const officer = await models.officer.find({
      where: { firstName: "Kirstin" }
    });
    expect(officer.updatedAt).toEqual(officer.createdAt);
  });
});
