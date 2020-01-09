import models from "../complaintManager/models";

export const transformDuplicateGenderIdentityId = async (
  civiliansWithIncorrectGenderIdentityIds,
  lastGoodGenderIdentity,
  Op,
  transaction
) => {

  for (let i = 0; i < civiliansWithIncorrectGenderIdentityIds.length; i++) {
    const civilianRow = civiliansWithIncorrectGenderIdentityIds[i];
    const genderIdentity = await models.gender_identity.findOne({
      attributes: ["name"],
      where: { id: civilianRow.genderIdentityId }
    });

    if (genderIdentity.name != null) {
      const correctId = await models.gender_identity.findOne({
        where: {
          name: genderIdentity.name,
          id: { [Op.lte]: lastGoodGenderIdentity }
        }
      });

      try {
        await updateDatabaseWithCorrectGenderIdentityId(
          civilianRow,
          correctId,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while transforming duplicate gender identity id for civilian with id ${civilianRow.id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithCorrectGenderIdentityId = async (
  civilianRow,
  correctId,
  transaction
) => {
  civilianRow.genderIdentityId = correctId.id;
  await civilianRow.save({auditUser: "ThoughtWorks dev team"});
};

export const deleteDuplicateGenderIdentities = async (
  duplicateRows,
  originalRows,
  transaction
) => {

    for (let i = 0; i < duplicateRows.length; i++) {
      const duplicateRow = duplicateRows[i];
      try {
        for (let j = 0; j < originalRows.length; j++) {
          const originalRow = originalRows[j];
          if (originalRow.name === duplicateRow.name) {
            await duplicateRow.destroy();
          }
        }
      } catch (error) {
        throw new Error(
          `Error while deleting duplicate gender identities at gender identity with id ${duplicateRow.id}. \nInternal Error: ${error}`
        )
      }
    }

};
