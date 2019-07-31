import models from "../../../models";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../client/testUtilities/civilian";
import {
  transformCivilianTitleToId,
  revertTransformCivilianTitleToId
} from "./transformCivilianTitleToId";

describe("transform civilian title to ID", () => {
  const civilianTitleProperties = {
    doctorMrs: {
      id: 1,
      name: "DrMrs"
    },
    miss: {
      id: 2,
      name: "Miss"
    },
    mr: {
      id: 3,
      name: "Mr."
    },
    mrs: {
      id: 4,
      name: "Mrs."
    },
    na: {
      id: 5,
      name: "N/A"
    }
  };

  let civilianTitles,
    testCivilians,
    civilianWithIdDrMrs,
    civilianWithIdMiss,
    civilianWithStringMr,
    civilianWithStringMrs,
    civilianWithOldTitleStringAndNewIdNa,
    civilianWithoutTitle;

  const selectCiviliansQuery = "Select * from civilians";

  const civilianTitlePropertiesArray = Object.keys(civilianTitleProperties).map(
    function(civilianTitleKey) {
      return civilianTitleProperties[civilianTitleKey];
    }
  );

  beforeEach(async () => {
    await models.civilian_title.bulkCreate(civilianTitlePropertiesArray, {
      auditUser: "A Person"
    });

    civilianTitles = await models.civilian_title.findAll();

    const existingCase = await createTestCaseWithoutCivilian();

    civilianWithIdDrMrs = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withCivilianTitleId(civilianTitleProperties.doctorMrs.id),
      { auditUser: "Another Person" }
    );
    civilianWithIdMiss = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withCivilianTitleId(civilianTitleProperties.miss.id),
      { auditUser: "Another Person" }
    );
    civilianWithStringMr = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id),
      { auditUser: "Another Person" }
    );
    civilianWithStringMrs = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id),
      { auditUser: "Another Person" }
    );
    civilianWithOldTitleStringAndNewIdNa = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withCivilianTitleId(civilianTitleProperties.na.id),
      { auditUser: "Another Person" }
    );
    civilianWithoutTitle = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withCaseId(existingCase.id),
      { auditUser: "Another Person" }
    );

    const updateCivilians = `UPDATE civilians SET title = '${
      civilianTitleProperties.mr.name
    }', civilian_title_id = null WHERE id = ${
      civilianWithStringMr.id
    }; UPDATE civilians SET title = '${
      civilianTitleProperties.mrs.name
    }', civilian_title_id = null WHERE id = ${
      civilianWithStringMrs.id
    }; UPDATE civilians SET title = '${
      civilianTitleProperties.doctorMrs.name
    }' WHERE id = ${civilianWithOldTitleStringAndNewIdNa.id};`;

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

  test("should correctly get civilian title id from title name", async () => {
    await models.sequelize.transaction(async transaction => {
      await transformCivilianTitleToId(
        civilianTitles,
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
          id: civilianWithOldTitleStringAndNewIdNa.id,
          civilian_title_id: civilianTitleProperties.na.id
        }),
        expect.objectContaining({
          id: civilianWithStringMrs.id,
          civilian_title_id: civilianTitleProperties.mrs.id
        }),
        expect.objectContaining({
          id: civilianWithStringMr.id,
          civilian_title_id: civilianTitleProperties.mr.id
        }),
        expect.objectContaining({
          id: civilianWithIdDrMrs.id,
          civilian_title_id: civilianTitleProperties.doctorMrs.id
        }),
        expect.objectContaining({
          id: civilianWithIdMiss.id,
          civilian_title_id: civilianTitleProperties.miss.id
        }),
        expect.objectContaining({
          id: civilianWithoutTitle.id,
          civilian_title_id: null
        })
      ])
    );
  });

  test("should revert migration changes and convert civilian title id to string name and unset civilian title id", async () => {
    await models.sequelize.transaction(async transaction => {
      await revertTransformCivilianTitleToId(
        civilianTitles,
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
          id: civilianWithStringMr.id,
          title: civilianTitleProperties.mr.name
        }),
        expect.objectContaining({
          id: civilianWithStringMrs.id,
          title: civilianTitleProperties.mrs.name
        }),
        expect.objectContaining({
          id: civilianWithIdMiss.id,
          title: civilianTitleProperties.miss.name
        }),
        expect.objectContaining({
          id: civilianWithIdDrMrs.id,
          title: civilianTitleProperties.doctorMrs.name
        }),
        expect.objectContaining({
          id: civilianWithoutTitle.id,
          title: null
        }),
        expect.objectContaining({
          id: civilianWithOldTitleStringAndNewIdNa.id,
          title: civilianTitleProperties.na.name
        })
      ])
    );
  });
});
