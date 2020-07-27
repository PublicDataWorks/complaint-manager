import models from "../../../complaintManager/models";
import sequelize from "sequelize";
import {
  CASE_STATUS,
  MANAGER_TYPE,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";

export const executeQuery = async nickname => {
  const date = new Date();
  const yearToDate = date.setFullYear(date.getFullYear(), 0, 1);

  const where = {
    deletedAt: null,
    firstContactDate: { [sequelize.Op.gte]: yearToDate },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: ["caseReferencePrefix"],
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

  let totalComplaints = {
    CC: 0,
    PO: 0,
    CN: 0,
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
