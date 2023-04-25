import models from "../../../policeDataManager/models";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";

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
        attributes: ["isAnonymous", "createdAt"],
        include: ["personTypeDetails"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        attributes: [
          "isAnonymous",
          "caseEmployeeType",
          "createdAt",
          "officerId"
        ],
        include: ["personTypeDetails"]
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        attributes: ["inmateId", "isAnonymous", "createdAt"],
        include: ["inmate", "personTypeDetails"]
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED] }
      },
      {
        model: models.personType,
        as: "defaultPersonType"
      }
    ],
    paranoid: false,
    where: where
  };

  const complaints = await models.sequelize.transaction(async transaction => {
    return await models.cases.findAll(queryOptions);
  });

  const personTypes = await models.personType.findAll();

  let totalComplaints = personTypes.reduce(
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
