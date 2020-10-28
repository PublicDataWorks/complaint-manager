import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

export const executeQuery = async nickname => {
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
      [sequelize.fn("COUNT", sequelize.col("cases.id")), "count"]
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

  const complaintsByIntakeSource = await models.sequelize.transaction(
    async transaction => {
      return await models.cases.findAll(queryOptions);
    }
  );

  return complaintsByIntakeSource;
};
