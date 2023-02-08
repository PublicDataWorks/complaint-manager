import models from "../../../policeDataManager/models";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const executeQuery = async (nickname, dateRange) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange)
  };

  const queryOptions = {
    attributes: ["caseReferencePrefix", "firstContactDate"],
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        attributes: ["isAnonymous", "createdAt"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        attributes: [
          "isAnonymous",
          "caseEmployeeType",
          "createdAt",
          "officerId"
        ]
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED] }
      }
    ],
    paranoid: false,
    where: where
  };

  const complaints = await models.sequelize.transaction(async transaction => {
    return await models.cases.findAll(queryOptions);
  });

  let totalComplaints = Object.values(PERSON_TYPE).reduce(
    (acc, type) => {
      acc[type.abbreviation] = 0;
      return acc;
    },
    {
      AC: 0
    }
  );

  const numComplaints = complaints.length;
  for (let i = 0; i < numComplaints; i++) {
    const complaint = complaints[i];
    const complainantType = complaint.get("caseReferencePrefix");
    totalComplaints[complainantType] += 1;
  }

  return totalComplaints;
};
