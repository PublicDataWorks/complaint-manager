import models from "../../../complaintManager/models";
import sequelize from "sequelize";

export const executeQuery = async () => {
  const date = new Date();
  const where = {
    deletedAt: null,
    firstContactDate: 
    {[sequelize.Op.gt]: date.setFullYear(date.getFullYear() - 1)}
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
