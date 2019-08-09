import Case from "../../../../client/testUtilities/case";
import models from "../../../models";
import transformCasesDistrictToId, {
  revertTransformCasesDistrictToId
} from "./transformCasesDistrictToId";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("transform case district to ID", () => {
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
    let testCases, firstCase, secondCase, noDistrictCase;
    beforeEach(async () => {
      firstCase = new Case.Builder()
        .defaultCase()
        .withId(1)
        .withDistrict("First District")
        .build();

      secondCase = new Case.Builder()
        .defaultCase()
        .withId(2)
        .withDistrict("Second District")
        .build();

      noDistrictCase = new Case.Builder()
        .defaultCase()
        .withId(3)
        .withDistrict(null)
        .build();

      testCases = [firstCase, secondCase, noDistrictCase];

      for (let i = 0; i < testCases.length; i++) {
        await models.cases.create(testCases[i], { auditUser: "Katmai" });
      }
    });

    test("transforms all districts into districtId for each case", async () => {
      await models.sequelize.transaction(async transaction => {
        const cases = await models.cases.findAll({ auditUser: "Katmai" });

        await transformCasesDistrictToId(
          districtsPropertiesArray,
          cases,
          transaction
        );

        const updatedCases = await models.cases.findAll({
          auditUser: "Katmai"
        });

        expect(updatedCases).toEqual(
          expect.toIncludeSameMembers([
            expect.objectContaining({
              id: firstCase.id,
              districtId: districts.firstDistrict.id,
              district: null
            }),
            expect.objectContaining({
              id: secondCase.id,
              districtId: districts.secondDistrict.id,
              district: null
            }),
            expect.objectContaining({
              id: noDistrictCase.id,
              districtId: null,
              district: null
            })
          ])
        );
      });
    });
  });

  describe("revert transforms district name to district id", () => {
    let testCases, firstCase, secondCase, noDistrictCase;

    beforeEach(async () => {
      firstCase = new Case.Builder()
        .defaultCase()
        .withId(1)
        .withDistrictId(districts.firstDistrict.id)
        .build();

      secondCase = new Case.Builder()
        .defaultCase()
        .withId(2)
        .withDistrictId(districts.secondDistrict.id)
        .build();

      noDistrictCase = new Case.Builder()
        .defaultCase()
        .withId(3)
        .withDistrictId(null)
        .build();

      testCases = [firstCase, secondCase, noDistrictCase];

      for (let i = 0; i < testCases.length; i++) {
        await models.cases.create(testCases[i], { auditUser: "Katmai" });
      }
    });

    test("transforms all district id into district for each case", async () => {
      await models.sequelize.transaction(async transaction => {
        const cases = await models.cases.findAll({ auditUser: "Katmai" });

        await revertTransformCasesDistrictToId(
          districtsPropertiesArray,
          cases,
          transaction
        );

        const updatedCases = await models.cases.findAll({
          auditUser: "Katmai"
        });

        expect(updatedCases).toEqual(
          expect.toIncludeSameMembers([
            expect.objectContaining({
              id: firstCase.id,
              districtId: null,
              district: "First District"
            }),
            expect.objectContaining({
              id: secondCase.id,
              districtId: null,
              district: "Second District"
            }),
            expect.objectContaining({
              id: noDistrictCase.id,
              districtId: null,
              district: null
            })
          ])
        );
      });
    });
  });
});
