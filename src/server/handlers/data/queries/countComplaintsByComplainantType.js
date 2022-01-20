import models from "../../../policeDataManager/models";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const executeQuery = async (nickname, dateRange) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange),
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
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
      }
    ],
    paranoid: false,
    where: where
  };

  const complaints = await models.sequelize.transaction(async transaction => {
    return await models.cases.findAll(queryOptions);
  });

  let totalComplaints = {
    [PERSON_TYPE.CIVILIAN.abbreviation]: 0,
    [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: 0,
    [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: 0,
    AC: 0
  };

  const numComplaints = complaints.length;
  for (let i = 0; i < numComplaints; i++) {
    const complaint = complaints[i];
    const complainantType = complaint.get("caseReferencePrefix");
    totalComplaints[complainantType] += 1;
  }

  return totalComplaints;
};
