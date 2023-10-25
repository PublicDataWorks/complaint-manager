import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { filter } from "lodash";

export const executeQuery = async (
  dateRange,
  filterCaseByStatus = [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange)
  };

  const queryOptions = {
    raw: true,
    where: where,
    attributes: [
      sequelize.col("incidentLocation.lat"),
      sequelize.col("incidentLocation.lng")
    ],
    include: [
      {
        model: models.address,
        attributes: ["lat", "lng"],
        as: "incidentLocation"
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: filterCaseByStatus }
      }
    ]
  };

  const result = await models.sequelize.transaction(async transaction => {
    const cases = await models.cases.findAll(queryOptions);
    return cases
      .filter(c => c["incidentLocation.lat"] && c["incidentLocation.lng"])
      .map(c => ({
        lat: c["incidentLocation.lat"],
        lon: c["incidentLocation.lng"]
      }));
  });

  return result;
};
