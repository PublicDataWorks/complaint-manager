import loadCsv from "./loadCsv";
import models from "../complaintManager/models/index";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("loadCsv", () => {
  afterEach(async () => {
    await cleanupDatabase();
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

  test("properly loads allegation data", async () => {
    await loadCsv("allegationSeedData.csv", models.allegation);
    const allegations = await models.allegation.findAll({
      where: {
        paragraph: "PARAGRAPH 04(a) - Neglect of Duty - General",
        directive:
          '1.22 "ARREST OF A CITY OF NEW ORLEANS EMPLOYEE" None Purpose  '
      }
    });

    expect(allegations.length).toEqual(1);
    expect(allegations[0].rule).toEqual("Rule 4: Performance of Duty");
    expect(allegations[0].paragraph).toEqual(
      "PARAGRAPH 04(a) - Neglect of Duty - General"
    );
    expect(allegations[0].directive).toEqual(
      '1.22 "ARREST OF A CITY OF NEW ORLEANS EMPLOYEE" None Purpose  '
    );
  });
});
