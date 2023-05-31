import loadCsv from "./loadCsv";
import models from "../policeDataManager/models/index";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("loadCsv", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it creates an officer for each row in the csv", async () => {
    await loadCsv("testOfficers.csv", models.officer);

    const officers = await models.officer.findAll();
    expect(officers.length).toEqual(3);

    const officer1 = officers[0].dataValues;
    expect(officer1.firstName).toEqual("Chris");
    expect(officer1.lastName).toEqual("Paucek");
  });
});
