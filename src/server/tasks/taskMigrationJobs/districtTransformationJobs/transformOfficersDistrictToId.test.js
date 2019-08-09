import models from "../../../models";
import transformOfficersDistrictToId, {
  revertTransformOfficersDistrictToId
} from "./transformOfficersDistrictToId";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../client/testUtilities/Officer";
import Case from "../../../../client/testUtilities/case";
import { revertTransformCasesDistrictToId } from "./transformCasesDistrictToId";

describe("transform officer district to ID", () => {
  const districts = {
    firstDistrict: {
      id: 1,
      name: "1st District"
    },
    secondDistrict: {
      id: 2,
      name: "2nd District"
    }
  };

  const districtsPropertiesArray = Object.keys(districts).map(function(
    districtKey
  ) {
    return districts[districtKey];
  });

  beforeEach(async () => {
    for (let i = 0; i < districtsPropertiesArray.length; i++) {
      await models.district.create(districtsPropertiesArray[i]);
    }
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("transforms district name to district id", () => {
    let testOfficers, firstOfficer, secondOfficer, noDistrictOfficer;

    beforeEach(async () => {
      firstOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(1)
        .withOfficerNumber(100)
        .withDistrict("First District")
        .build();

      secondOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(2)
        .withOfficerNumber(200)
        .withDistrict("Second District")
        .build();

      noDistrictOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(3)
        .withOfficerNumber(300)
        .withDistrict(null)
        .build();

      testOfficers = [firstOfficer, secondOfficer, noDistrictOfficer];

      for (let i = 0; i < testOfficers.length; i++) {
        await models.officer.create(testOfficers[i], { auditUser: "Katmai" });
      }
    });

    test("transforms all districts into districtId for each officer", async () => {
      await models.sequelize.transaction(async transaction => {
        const officers = await models.officer.findAll({ auditUser: "Katmai" });

        await transformOfficersDistrictToId(
          districtsPropertiesArray,
          officers,
          transaction
        );

        const updatedOfficers = await models.officer.findAll({
          auditUser: "Katmai"
        });

        expect(updatedOfficers).toEqual(
          expect.toIncludeSameMembers([
            expect.objectContaining({
              id: firstOfficer.id,
              districtId: districts.firstDistrict.id
            }),
            expect.objectContaining({
              id: secondOfficer.id,
              districtId: districts.secondDistrict.id
            }),
            expect.objectContaining({
              id: noDistrictOfficer.id,
              districtId: null
            })
          ])
        );
      });
    });
  });

  describe("revert transforms district name to district id", () => {
    let testOfficers, firstOfficer, secondOfficer, noDistrictOfficer;

    beforeEach(async () => {
      firstOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(1)
        .withOfficerNumber(100)
        .withDistrictId(districts.firstDistrict.id)
        .build();

      secondOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(2)
        .withOfficerNumber(200)
        .withDistrictId(districts.secondDistrict.id)
        .build();

      noDistrictOfficer = new Officer.Builder()
        .defaultOfficer()
        .withId(3)
        .withOfficerNumber(300)
        .withDistrictId(null)
        .build();

      testOfficers = [firstOfficer, secondOfficer, noDistrictOfficer];

      for (let i = 0; i < testOfficers.length; i++) {
        await models.officer.create(testOfficers[i], { auditUser: "Katmai" });
      }
    });

    test("transforms all district id into district for each officer", async () => {
      await models.sequelize.transaction(async transaction => {
        const officers = await models.officer.findAll({ auditUser: "Katmai" });

        await revertTransformOfficersDistrictToId(
          districtsPropertiesArray,
          officers,
          transaction
        );

        const updatedOfficers = await models.officer.findAll({
          auditUser: "Katmai"
        });

        expect(updatedOfficers).toEqual(
          expect.toIncludeSameMembers([
            expect.objectContaining({
              id: firstOfficer.id,
              districtId: null,
              district: "First District"
            }),
            expect.objectContaining({
              id: secondOfficer.id,
              districtId: null,
              district: "Second District"
            }),
            expect.objectContaining({
              id: noDistrictOfficer.id,
              districtId: null,
              district: null
            })
          ])
        );
      });
    });
  });
});
