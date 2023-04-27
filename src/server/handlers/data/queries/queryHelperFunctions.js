import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";
import sequelize from "sequelize";

export const updateCaseStatus = async (
  caseToUpdate,
  desiredStatus,
  statuses
) => {
  await caseToUpdate.update(
    {
      statusId: statuses.find(status => status.name === desiredStatus).id
    },
    { auditUser: "someone" }
  );
  caseToUpdate.reload();
};

export const getDateRangeStart = (
  dateRangeType = DATE_RANGE_TYPE.YTD,
  currentDate = new Date()
) => {
  let dateRangeStart;
  if (dateRangeType === DATE_RANGE_TYPE.YTD) {
    dateRangeStart = moment(currentDate).startOf("year");
  } else if (dateRangeType === DATE_RANGE_TYPE.PAST_12_MONTHS) {
    dateRangeStart = moment(currentDate).subtract(12, "months");
  } else {
    throw new Error(
      `${BAD_REQUEST_ERRORS.INVALID_DATE_RANGE_TYPE}: ${dateRangeType}`
    );
  }
  return dateRangeStart;
};

export const calculateFirstContactDateCriteria = (
  dateRange,
  defaultMinDate
) => {
  let firstContactDate = {};
  if (dateRange?.minDate) {
    firstContactDate[sequelize.Op.gte] = moment(dateRange.minDate);
  } else {
    firstContactDate[sequelize.Op.gte] = defaultMinDate
      ? defaultMinDate
      : moment().dayOfYear(1); // default to YTD
  }

  if (dateRange?.maxDate) {
    firstContactDate[sequelize.Op.lte] = moment(dateRange.maxDate);
  }
  return firstContactDate;
};

export const getLegendValue = complaint => {
  if (!complaint.primaryComplainant) {
    return complaint.defaultPersonType.legend;
  } else if (complaint.primaryComplainant.isAnonymous) {
    return "Anonymous (AC)";
  } else if (!complaint.primaryComplainant.personTypeDetails) {
    return complaint.defaultPersonType.legend;
  } else {
    return complaint.primaryComplainant.personTypeDetails.legend;
  }
};
