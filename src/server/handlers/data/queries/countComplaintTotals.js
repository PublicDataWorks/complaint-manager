import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

const filterCaseByStatus =
  process.env.ORG == "HAWAII"
    ? [
        CASE_STATUS.FORWARDED_TO_AGENCY,
        CASE_STATUS.CLOSED,
        CASE_STATUS.ACTIVE,
        CASE_STATUS.INITIAL,
        CASE_STATUS.LETTER_IN_PROGRESS,
        CASE_STATUS.READY_FOR_REVIEW
      ]
    : [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED];

export const executeQuery = async nickname => {
  const getCountByDateRange = async (startDate, endDate) => {
    const where = {
      deletedAt: null,
      firstContactDate: {
        [sequelize.Op.gte]: startDate,
        [sequelize.Op.lte]: endDate
      }
    };

    const queryOptions = {
      where: where,
      include: [
        {
          model: models.caseStatus,
          as: "status",
          attributes: [],
          where: { name: filterCaseByStatus }
        }
      ],
      attributes: ["id"]
    };

    const complaints = await models.sequelize.transaction(async transaction => {
      return await models.cases.findAll(queryOptions);
    });
    return complaints.length;
  };

  const currentDate = new Date();

  const firstDayCurrentYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear(), 0, 1)
  );

  const countCurrentYear = await getCountByDateRange(
    firstDayCurrentYear,
    new Date()
  );

  const firstDayPreviousYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear() - 1, 0, 1)
  );
  const lastDayPreviousYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear(), 11, 31)
  );

  const countPreviousYear = await getCountByDateRange(
    firstDayPreviousYear,
    lastDayPreviousYear
  );

  return { ytd: countCurrentYear, previousYear: countPreviousYear };
};
