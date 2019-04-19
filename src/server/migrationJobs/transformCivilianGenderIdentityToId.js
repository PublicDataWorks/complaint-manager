import models from "../models";
import _ from "lodash";

export const transformCivilianGenderIdentityToId = async (
  genderIdentities,
  civilians,
  transaction
) => {
  const genderIdentityDictionary = {};
  genderIdentities.forEach(genderIdentity => {
    genderIdentityDictionary[genderIdentity.name] = genderIdentity.id;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (
      !civilians[i].gender_identity_id &&
      !_.isEmpty(civilians[i].gender_identity)
    ) {
      await updateDatabaseWithCorrectGenderIdentityId(
        civilians[i],
        genderIdentityDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectGenderIdentityId = async (
  civilian,
  genderIdentityDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET gender_identity_id = ${
    genderIdentityDictionary[civilian.gender_identity]
  } WHERE id = ${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};

export const revertTransformCivilianGenderIdentityToId = async (
  genderIdentities,
  civilians,
  transaction
) => {
  const genderIdentityDictionary = {};
  genderIdentities.forEach(genderIdentity => {
    genderIdentityDictionary[genderIdentity.id] = genderIdentity.name;
  });

  for (let i = 0; i < civilians.length; i++) {
    if (civilians[i].gender_identity_id) {
      await updateDatabaseWithCorrectGenderIdentityString(
        civilians[i],
        genderIdentityDictionary,
        transaction
      );
    }
  }
};

const updateDatabaseWithCorrectGenderIdentityString = async (
  civilian,
  genderIdentityDictionary,
  transaction
) => {
  const updateCivilianQuery = `UPDATE civilians SET gender_identity = '${
    genderIdentityDictionary[civilian.gender_identity_id]
  }', gender_identity_id = null WHERE id = ${civilian.id}`;

  await models.sequelize.query(updateCivilianQuery, {
    type: models.sequelize.QueryTypes.UPDATE,
    transaction
  });
};
