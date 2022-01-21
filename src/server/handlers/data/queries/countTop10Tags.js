import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import {
  ASCENDING,
  CASE_STATUS,
  DESCENDING
} from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";

export const executeQuery = async (nickname, dateRange) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange),
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: [
      "tag.name",
      [sequelize.fn("COUNT", sequelize.col("case_tag.case_id")), "count"]
    ],
    include: [
      {
        model: models.tag,
        as: "tag",
        attributes: []
      },
      {
        model: models.cases,
        where: where,
        attributes: []
      }
    ],
    raw: true,
    group: "tag.name",
    limit: 10,
    order: [["count", DESCENDING]]
  };

  const countByTop10Tags = await models.sequelize.transaction(
    async transaction => {
      return await models.case_tag.findAll(queryOptions);
    }
  );

  return countByTop10Tags;
};
