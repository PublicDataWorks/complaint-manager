import models from "../models";
import _ from "lodash";

export const transformCivilianTitleToId = async (
  civilianTitles,
  civilians,
  transaction
) => {
  const civilianTitleDictionary = {};
  civilianTitles.forEach(civilianTitle => {
    civilianTitleDictionary[civilianTitle.name] = civilianTitle.id;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (!civilians[i].civilian_title_id && !_.isEmpty(civilians[i].title)) {
      await updateDatabaseWithCorrectCivilianTitleId(
        civilians[i],
        civilianTitleDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectCivilianTitleId = async (
  civilian,
  civilianTitleDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET civilian_title_id = ${
    civilianTitleDictionary[civilian.title]
  }, title = null WHERE id = ${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};

export const revertTransformCivilianTitleToId = async (
  civilianTitles,
  civilians,
  transaction
) => {
  const civilianTitleDictionary = {};
  civilianTitles.forEach(civilianTitle => {
    civilianTitleDictionary[civilianTitle.id] = civilianTitle.name;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (civilians[i].civilian_title_id) {
      await updatedDatabaseWithCorrectCivilianTitleString(
        civilians[i],
        civilianTitleDictionary,
        transaction
      );
    }
  }
};

const updatedDatabaseWithCorrectCivilianTitleString = async (
  civilian,
  civilianTitleDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET title = '${
    civilianTitleDictionary[civilian.civilian_title_id]
  }', civilian_title_id = null WHERE id =${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};
