import models from "../../../policeDataManager/models";

export const updateCaseToActiveIfInitial = async (
  caseId,
  nickname,
  transaction
) => {
  const c4se = await models.cases.findByPk(caseId, {
    include: ["currentStatus"],
    transaction
  });

  if (c4se && c4se.currentStatus.name === "Initial") {
    const activeStatus = await models.caseStatus.findOne({
      where: { name: "Active" },
      transaction
    });

    if (activeStatus) {
      await c4se.update(
        { currentStatusId: activeStatus.id },
        { auditUser: nickname, transaction }
      );
    }
  }
};
