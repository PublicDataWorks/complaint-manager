import sequelize from "sequelize";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import models from "../../../complaintManager/models";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import moment from "moment";
import _ from "lodash";

export const dateRange = start => {
  let startDate = moment(start).format("YYYY-MM-DD");

  let counts = [];
  let dateToIndex = {};

  for (let i = 0; i <= 12; i++) {
    counts.push({ date: moment(startDate).format("MMM YY"), count: 0 });
    dateToIndex[moment(startDate).format("YYYY-MM")] = i;

    startDate = moment(startDate).add(1, "month");
  }
  return { counts: counts, dateToIndex: dateToIndex };
};

export const getAllComplaints = async (startDate, endDate, nickname) => {
  const where = {
    deletedAt: null,
    firstContactDate: {
      [sequelize.Op.gte]: startDate,
      [sequelize.Op.lte]: endDate
    },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: ["id", "caseReferencePrefix", "firstContactDate"],
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
    const allCasesPast12Months = await models.cases.findAll(queryOptions);

    const auditDetails = getQueryAuditAccessDetails(
      queryOptions,
      models.cases.name
    );

    await auditDataAccess(
      nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.VISUALIZATION_COMPLAINANT_TYPE_PAST_12_MONTHS,
      auditDetails,
      transaction
    );

    return allCasesPast12Months;
  });
  return complaints;
};

export const executeQuery = async nickname => {
  const date = new Date();

  const endDate = date.setFullYear(date.getFullYear(), date.getMonth(), 0);

  const startDate = date.setFullYear(
    date.getFullYear() - 1,
    date.getMonth(),
    1
  );

  let { counts, dateToIndex } = dateRange(startDate);

  let totalComplaints = {
    CC: _.cloneDeep(counts),
    PO: _.cloneDeep(counts),
    CN: _.cloneDeep(counts),
    AC: _.cloneDeep(counts)
  };

  const complaints = await getAllComplaints(startDate, endDate, nickname);

  const numComplaints = complaints.length;
  for (let i = 0; i < numComplaints; i++) {
    const complaint = complaints[i];
    const complainantType = complaint.get("caseReferencePrefix");
    const formattedFirstContactDate = moment(complaint.firstContactDate).format(
      "YYYY-MM"
    );
    totalComplaints[complainantType][dateToIndex[formattedFirstContactDate]][
      "count"
    ] += 1;
  }

  return totalComplaints;
};
