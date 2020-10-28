import models from "../policeDataManager/models";
import _ from "lodash";

export const transformRaceEthnicityToId = async (
  raceEthnicities,
  civilians,
  transaction
) => {
  const raceEthnicityDictionary = {};
  raceEthnicities.forEach(raceEthnicity => {
    raceEthnicityDictionary[raceEthnicity.name] = raceEthnicity.id;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (
      !civilians[i].race_ethnicity_id &&
      !_.isEmpty(civilians[i].race_ethnicity)
    ) {
      await updateDatabaseWithCorrectRaceEthnicityId(
        civilians[i],
        raceEthnicityDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectRaceEthnicityId = async (
  civilian,
  raceEthnicityDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET race_ethnicity_id = ${
    raceEthnicityDictionary[civilian.race_ethnicity]
  } WHERE id = ${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};

export const revertTransformRaceEthnicityToId = async (
  raceEthnicities,
  civilians,
  transaction
) => {
  const raceEthnicityDictionary = {};
  raceEthnicities.forEach(raceEthnicity => {
    raceEthnicityDictionary[raceEthnicity.id] = raceEthnicity.name;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (civilians[i].race_ethnicity_id) {
      await updateDatabaseWithCorrectRaceEthnicityString(
        civilians[i],
        raceEthnicityDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectRaceEthnicityString = async (
  civilian,
  raceEthnicityDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET race_ethnicity = '${
    raceEthnicityDictionary[civilian.race_ethnicity_id]
  }', race_ethnicity_id = null WHERE id = ${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};
