import loadCsvFromS3 from "./loadCsvFromS3";
import models from "../policeDataManager/models/index";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import path from "path";
import fs from "fs";

const AWS = require("aws-sdk");

let testAllegationsPath = path.join(__dirname, "testAllegations.csv");

jest.mock("aws-sdk", () => ({
  S3: jest.fn()
}));

describe("loadCsvFromS3", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  AWS.S3.mockImplementation(() => ({
    getObject: () => ({
      createReadStream: () => fs.createReadStream(testAllegationsPath)
    }),
    config: {
      loadFromPath: jest.fn(),
      update: jest.fn()
    }
  }));

  test("properly loads allegation data from S3", async () => {
    await loadCsvFromS3("testAllegations.csv", models.allegation);

    const allegations = await models.allegation.findAll();
    expect(allegations.length).toEqual(2);

    const allegation1 = allegations[0].dataValues;
    expect(allegation1.rule).toEqual("Rule 4: Performance of Duty");
    expect(allegation1.paragraph).toEqual("4:1 Reporting for Duty");
    expect(allegation1.directive).toBeNull();

    const allegation2 = allegations[1].dataValues;
    expect(allegation2.rule).toEqual("Rule 4: Performance of Duty");
    expect(allegation2.paragraph).toEqual(
      "4:2 Instructions from Authoritative Source"
    );
    expect(allegation2.directive).toEqual(
      "1.1 Law Enforcement Authority 1-10 Policy Statement"
    );
  });

  test("properly adds new allegation data to db from s3", async () => {
    testAllegationsPath = path.join(
      __dirname,
      "testAllegationsUpdatedData.csv"
    );

    await loadCsvFromS3("testAllegationsUpdatedData.csv", models.allegation);

    const newAllegationData = await models.allegation.findAll();
    expect(newAllegationData.length).toEqual(3);
  });
});
