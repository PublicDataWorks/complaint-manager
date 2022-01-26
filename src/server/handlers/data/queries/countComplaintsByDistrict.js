import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import { CASE_STATUS, DESCENDING } from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";
import { Op } from "sequelize";

export const executeQuery = async (nickname, dateRange) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange),
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED],
    districtId: { [Op.not]: null }
  };

  const queryOptions = {
    attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "count"]],
    include: [
      {
        model: models.district,
        as: "caseDistrict",
        attributes: ["name"]
      }
    ],
    raw: true,
    group: "caseDistrict.name",
    where,
    order: [["count", DESCENDING]]
  };

  const countByTop10Tags = await models.sequelize.transaction(
    async transaction => {
      return await models.cases.findAll(queryOptions);
    }
  );

  return countByTop10Tags.map(district => ({
    district: district["caseDistrict.name"],
    count: parseInt(district.count)
  }));
};
