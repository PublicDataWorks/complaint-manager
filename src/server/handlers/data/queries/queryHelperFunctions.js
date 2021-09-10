import {
  DATE_RANGE_TYPE,
  CASE_STATUS
} from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const updateCaseStatus = async (caseToUpdate, status) => {
  const caseStatusList = [
    CASE_STATUS.ACTIVE,
    CASE_STATUS.LETTER_IN_PROGRESS,
    CASE_STATUS.READY_FOR_REVIEW,
    CASE_STATUS.FORWARDED_TO_AGENCY,
    CASE_STATUS.CLOSED
  ];

  for (const caseStatus in caseStatusList) {
    await caseToUpdate.update(
      { status: caseStatusList[caseStatus] },
      { auditUser: "someone" }
    );
    if (caseStatusList[caseStatus] === status) {
      return;
    }
  }
  caseToUpdate.reload();
};

export const getComplainantType = caseReference => {
  let prefix = caseReference.substring(0, 2);
  let complainantType;

  if (prefix === "AC") {
    complainantType = "Anonymous (AC)";
  } else {
    switch (prefix) {
      case PERSON_TYPE.CIVILIAN.abbreviation:
        complainantType = "Civilian (CC)";
        break;
      case PERSON_TYPE.KNOWN_OFFICER.abbreviation:
        complainantType = "Police Officer (PO)";
        break;
      case PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation:
        complainantType = "Civilian Within NOPD (CN)";
        break;
      default:
        complainantType = "Civilian (CC)";
    }
  }
  return complainantType;
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
