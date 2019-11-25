import {
  CIVILIAN_INITIATED,
  CIVILIAN_WITHIN_NOPD_INITIATED,
  RANK_INITIATED
} from "../../../../sharedUtilities/constants";
import Boom from "boom";
import { BAD_DATA_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

export const getCaseReference = (complaintType, caseNumber, year) => {
  let prefix;
  switch (complaintType) {
    case CIVILIAN_INITIATED:
      prefix = "CC";
      break;
    case RANK_INITIATED:
      prefix = "PO";
      break;
    case CIVILIAN_WITHIN_NOPD_INITIATED:
      prefix = "CN";
      break;
    default:
      throw Boom.badData(BAD_DATA_ERRORS.INVALID_COMPLAINANT_TYPE);
  }
  const paddedCaseId = `${caseNumber}`.padStart(4, "0");
  return `${prefix}${year}-${paddedCaseId}`;
};
