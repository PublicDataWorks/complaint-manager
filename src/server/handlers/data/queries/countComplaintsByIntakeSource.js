import models from "../../../complaintManager/models";
import sequelize from "sequelize";

export const executeQuery = async () => {
  const where = {
    deletedAt: null
  };

  const queryOptions = {
    attributes: [
      "intakeSource.name",
      [sequelize.fn("COUNT", sequelize.col("cases.id")), "cases"]
    ],
    include: [
      {
        model: models.intake_source,
        as: "intakeSource",
        attributes: []
      }
    ],
    raw: true,
    group: "intakeSource.name",
    where: where
  };

  return await models.cases.findAll(queryOptions);
};
