import models from "../../../complaintManager/models";
import sequelize from "sequelize";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

export const executeQuery = async () => {
  const date = new Date();
  const yearToDate = date.setFullYear(date.getFullYear(), 0, 1);

  const where = {
    deletedAt: null,
    firstContactDate: { [sequelize.Op.gte]: yearToDate },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
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
