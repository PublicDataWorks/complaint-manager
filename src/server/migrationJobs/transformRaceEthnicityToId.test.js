import models from "../policeDataManager/models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../testHelpers/modelMothers";
import Civilian from "../../sharedTestHelpers/civilian";
import CaseStatus from "../../sharedTestHelpers/caseStatus";
import {
  revertTransformRaceEthnicityToId,
  transformRaceEthnicityToId
} from "./transformRaceEthnicityToId";

describe("transform race ethnicity to ID", () => {
  const raceEthnicityProperties = {
    chinese: {
      id: 1,
      name: "Chinese"
    },
    cuban: {
      id: 2,
      name: "Cuban"
    },
    korean: {
      id: 3,
      name: "Korean"
    },
    unknown: {
      id: 4,
      name: "Unknown"
    },
    blackAfricanAmerican: {
      id: 5,
      name: "Black, African American"
    }
  };

  let raceEthnicities,
    testCivilians,
    civilianWithRaceEthnicityIdChinese,
    civilianWithRaceEthnicityIdCuban,
    civilianWithRaceEthnicityStringKorean,
    civilianWithRaceEthnicityStringUnknown,
    civilianWithOldRaceEthnicityStringAndNewId,
    civilianWithoutRaceEthnicity;

  const selectCiviliansQuery = "SELECT * from civilians;";

  const raceEthnicityPropertiesArray = Object.keys(raceEthnicityProperties).map(
    function (raceEthnicityKey) {
      return raceEthnicityProperties[raceEthnicityKey];
    }
  );

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    await models.race_ethnicity.bulkCreate(raceEthnicityPropertiesArray, {
      auditUser: "test"
    });

    raceEthnicities = await models.race_ethnicity.findAll();

    const existingCase = await createTestCaseWithoutCivilian();

    civilianWithRaceEthnicityIdChinese = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName(raceEthnicityProperties.chinese.name)
        .withCaseId(existingCase.id)
        .withRaceEthnicityId(raceEthnicityProperties.chinese.id),
      { auditUser: "testUser" }
    );

    civilianWithRaceEthnicityIdCuban = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName(raceEthnicityProperties.cuban.name)
        .withCaseId(existingCase.id)
        .withRaceEthnicityId(raceEthnicityProperties.cuban.id),
      { auditUser: "testUser" }
    );

    civilianWithRaceEthnicityStringKorean = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName(raceEthnicityProperties.korean.name)
        .withCaseId(existingCase.id),
      { auditUser: "testUser" }
    );

    civilianWithRaceEthnicityStringUnknown = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName(raceEthnicityProperties.unknown.name)
        .withCaseId(existingCase.id),
      { auditUser: "testUser" }
    );

    civilianWithOldRaceEthnicityStringAndNewId = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName("Name is old")
        .withLastName("Id is new")
        .withCaseId(existingCase.id)
        .withRaceEthnicityId(raceEthnicityProperties.blackAfricanAmerican.id),
      { auditUser: "testUser" }
    );

    civilianWithoutRaceEthnicity = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id),
      { auditUser: "testUser" }
    );

    const updateCivilians =
      `UPDATE civilians SET race_ethnicity = '${raceEthnicityProperties.korean.name}', race_ethnicity_id = null WHERE id = ${civilianWithRaceEthnicityStringKorean.id};` +
      ` UPDATE civilians SET race_ethnicity = '${raceEthnicityProperties.unknown.name}', race_ethnicity_id = null WHERE id = ${civilianWithRaceEthnicityStringUnknown.id};` +
      ` UPDATE civilians SET race_ethnicity = '${raceEthnicityProperties.unknown.name}' WHERE id = ${civilianWithOldRaceEthnicityStringAndNewId.id}`;

    await models.sequelize.query(updateCivilians, {
      type: models.sequelize.QueryTypes.UPDATE
    });

    testCivilians = await models.sequelize.query(selectCiviliansQuery, {
      type: models.sequelize.QueryTypes.SELECT
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should correctly get race ethnicity id from race ethnicity name", async () => {
    await models.sequelize.transaction(async transaction => {
      await transformRaceEthnicityToId(
        raceEthnicities,
        testCivilians,
        transaction
      );
    });
    const transformedCiviliansResult = await models.sequelize.query(
      selectCiviliansQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCiviliansResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: civilianWithOldRaceEthnicityStringAndNewId.id,
          race_ethnicity_id:
            civilianWithOldRaceEthnicityStringAndNewId.raceEthnicityId
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityStringUnknown.id,
          race_ethnicity_id: raceEthnicityProperties.unknown.id
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityStringKorean.id,
          race_ethnicity_id: raceEthnicityProperties.korean.id
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityIdChinese.id,
          race_ethnicity_id: civilianWithRaceEthnicityIdChinese.raceEthnicityId
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityIdCuban.id,
          race_ethnicity_id: civilianWithRaceEthnicityIdCuban.raceEthnicityId
        }),
        expect.objectContaining({
          id: civilianWithoutRaceEthnicity.id,
          race_ethnicity_id: null
        })
      ])
    );
  });

  test("should convert race ethnicity id to race ethnicity name and unset race ethnicity id", async () => {
    await models.sequelize.transaction(async transaction => {
      await revertTransformRaceEthnicityToId(
        raceEthnicities,
        testCivilians,
        transaction
      );
    });

    const transformedCiviliansResult = await models.sequelize.query(
      selectCiviliansQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCiviliansResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: civilianWithOldRaceEthnicityStringAndNewId.id,
          race_ethnicity: raceEthnicityProperties.blackAfricanAmerican.name
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityStringUnknown.id,
          race_ethnicity: raceEthnicityProperties.unknown.name
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityStringKorean.id,
          race_ethnicity: raceEthnicityProperties.korean.name
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityIdChinese.id,
          race_ethnicity: raceEthnicityProperties.chinese.name
        }),
        expect.objectContaining({
          id: civilianWithRaceEthnicityIdCuban.id,
          race_ethnicity: raceEthnicityProperties.cuban.name
        }),
        expect.objectContaining({
          id: civilianWithoutRaceEthnicity.id,
          race_ethnicity: null
        })
      ])
    );
  });
});
