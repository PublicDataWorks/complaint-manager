import models from "../policeDataManager/models";

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
        await updateDatabaseWithCorrectAttributeId(
          civilianRow,
          "genderIdentityId",
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

export const updateDatabaseWithCorrectAttributeId = async (
  rowToUpdate,
  attributeToUpdate,
  correctId,
  transaction
) => {
  rowToUpdate[`${attributeToUpdate}`] = correctId.id;
  await rowToUpdate.save({ auditUser: "ThoughtWorks dev team" });
};
