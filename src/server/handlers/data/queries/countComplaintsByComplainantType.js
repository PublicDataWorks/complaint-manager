import models from "../../../complaintManager/models";
import sequelize from "sequelize";
import {
  CASE_STATUS,
  MANAGER_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import { getComplainantType } from "./queryHelperFunctions";

export const executeQuery = async nickname => {
  const date = new Date();
  const yearToDate = date.setFullYear(date.getFullYear(), 0, 1);

  const where = {
    deletedAt: null,
    firstContactDate: { [sequelize.Op.gte]: yearToDate },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: ["caseReference"],
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
    const allComplaintsWithCaseRef = await models.cases.findAll(queryOptions);
    const auditDetails = getQueryAuditAccessDetails(
      queryOptions,
      models.cases.name
    );

    await auditDataAccess(
      nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.VISUALIZATION_COMPLAINANT_TYPE,
      auditDetails,
      transaction
    );
    return allComplaintsWithCaseRef;
  });

  const complaintsByComplainantType = await Promise.all(
    complaints.map(async complaint => {
      const caseReference = complaint.get("caseReference");
      const complainantType = await getComplainantType(caseReference);

      return { complainantType: complainantType };
    })
  );

  return complaintsByComplainantType;
};
