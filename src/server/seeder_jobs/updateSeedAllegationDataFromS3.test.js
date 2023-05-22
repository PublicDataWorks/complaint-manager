import loadCsv from "./loadCsv";
import models from "../policeDataManager/models";
import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../testHelpers/requestTestHelpers";
import fs from "fs";
import path from "path";
import updateSeedAllegationDataFromS3 from "./updateSeedAllegationDataFromS3";

const testAllegationCsvPath = path.join(
  __dirname,
  "testAllegationsUpdatedData.csv"
);

const mockS3 = {
  getObject: jest.fn(async () => ({
    Body: fs.createReadStream(testAllegationCsvPath)
  }))
};
jest.mock("../createConfiguredS3Instance", () => jest.fn(() => mockS3));

describe("updating database using csv file in S3", () => {
  beforeEach(async () => {
    await loadCsv("testAllegations.csv", models.allegation);
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
      await updateSeedAllegationDataFromS3(testAllegationCsvPath);

      const unchangedAllegationRule4 = await models.allegation.findOne({
        where: { rule: "Rule 4: Performance of Duty" }
      });
      const newAllegationRule3 = await models.allegation.findOne({
        where: { rule: "Rule 3: Performance of Duty" }
      });
      const updatedAllegationRule7 = await models.allegation.findOne({
        where: { rule: "Rule 7: Department Property" }
      });

      console.log("unchanged Allegation>>>", unchangedAllegationRule4);
      console.log("new Allegatoin>>>", newAllegationRule3);
      console.log("updatedAllegation>>>", updatedAllegationRule7);

      expect(unchangedAllegationRule4.rule).toEqual(
        "Rule 4: Performance of Duty"
      );
      expect(unchangedAllegationRule4.paragraph).toEqual(
        "4:1 Reporting for Duty"
      );
      expect(unchangedAllegationRule4.directive).toEqual(null);
      expect(newAllegationRule3.rule).toEqual("Rule 3: Performance of Duty");
      expect(newAllegationRule3.paragraph).toEqual(
        "4:3 Instructions from Authoritative Source"
      );
      expect(newAllegationRule3.directive).toEqual(
        "1.2 Law Enforcement Authority"
      );
      expect(updatedAllegationRule7.rule).toEqual(
        "Rule 7: Department Property"
      );
      expect(updatedAllegationRule7.paragraph).toEqual(
        "Paragraph 01 - Use of Department Property"
      );
      expect(updatedAllegationRule7.directive).toEqual("N/A");
    })
  );
});
