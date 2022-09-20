import models from "../index";
import moment from "moment";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../sharedTestHelpers/Officer";

describe("officers", () => {
  describe("fullName", () => {
    test("fullName should be constructed of first, middle, and last", () => {
      const officer = models.officer.build({
        firstName: "Johann",
        middleName: "Sebastian",
        lastName: "Bach"
      });

      expect(officer.fullName).toEqual("Johann Sebastian Bach");
    });

    test("fullName should only include one space when no middle name", () => {
      const officer = models.officer.build({
        firstName: "Johann",
        middleName: "",
        lastName: "Bach"
      });

      expect(officer.fullName).toEqual("Johann Bach");
    });
  });

  describe("age", () => {
    test("age should be calculated as today minus dob, without fractions", () => {
      const dob = moment().subtract(45, "years").subtract(9, "months");
      const officer = models.officer.build({ dob: dob });
      expect(officer.age).toEqual(45);
    });
    test("age should be null if dob is null", () => {
      const officer = models.officer.build({ dob: null });
      expect(officer.age).toEqual(null);
    });
  });

  describe("district", () => {
    beforeEach(async () => {
      await models.district.create({
        id: 1,
        name: "1st District"
      });
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    afterAll(async () => {
      await models.sequelize.close();
    });

    test("district should display in numeric format", async () => {
      await models.officer.create({
        id: null,
        districtId: 1,
        firstName: "Johann",
        middleName: "",
        lastName: "Bach",
        officerNumber: 1
      });

      const officer = await models.officer.findOne({
        where: {
          firstName: "Johann"
        },
        include: [{ model: models.district, as: "officerDistrict" }]
      });

      expect(officer.officerDistrict.name).toEqual("1st District");
    });

    test("district should be blank if blank", () => {
      const officer = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withDistrictId(null);

      expect(officer.officerDistrict).toEqual(null);
    });
  });
});
