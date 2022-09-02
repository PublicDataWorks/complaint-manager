import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";

export const executeQuery = async (nickname, dateRange) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange)
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
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED] }
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
