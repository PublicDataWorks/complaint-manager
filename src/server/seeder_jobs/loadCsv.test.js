import loadCsv from "./loadCsv";
import models from "../models/index";

describe("loadCsv", () => {
  afterEach(async () => {
    await models.case_officer.destroy({ truncate: true, cascade: true });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.allegation.destroy({ truncate: true, cascade: true });
  });

  test("it creates an officer for each row in the csv", async () => {
    await loadCsv("testOfficers.csv", models.officer);

    const officers = await models.officer.findAll();
    expect(officers.length).toEqual(2);

    const officer1 = officers[0].dataValues;
    expect(officer1.firstName).toEqual("Chris");
    expect(officer1.lastName).toEqual("Paucek");
  });
  test("it creates an allegation for each row in the csv", async () => {
    await loadCsv("testAllegations.csv", models.allegation);

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
});
