import asyncMiddleware from "../asyncMiddleware";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import { CASE_STATUS, QUERY_TYPES } from "../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as countComplaintTotals from "./queries/countComplaintTotals";
import * as countComplaintsByComplainantType from "./queries/countComplaintsByComplainantType";
import * as countMonthlyComplaintsByComplainantType from "./queries/countMonthlyComplaintsByComplainantType";
import * as countTop10Tags from "./queries/countTop10Tags";
import * as countTop10Allegations from "./queries/countTop10Allegations";
import * as locationDataQuery from "./queries/locationData";
import * as countComplaintsByDistrict from "./queries/countComplaintsByDistrict";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";

const getData = asyncMiddleware(async (request, response, next) => {
  let data;
  const queryType = request.query.queryType;
  const dateRange = {
    minDate: request.query.minDate,
    maxDate: request.query.maxDate
  };

  const displayAllStatusInDashboard = checkFeatureToggleEnabled(
    request,
    "displayAllStatusInDashboard"
  );

  const filterCaseByStatus = displayAllStatusInDashboard
    ? [
        CASE_STATUS.FORWARDED_TO_AGENCY,
        CASE_STATUS.CLOSED,
        CASE_STATUS.ACTIVE,
        CASE_STATUS.INITIAL,
        CASE_STATUS.LETTER_IN_PROGRESS,
        CASE_STATUS.READY_FOR_REVIEW
      ]
    : [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED];

  switch (queryType) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      data = await countComplaintsByIntakeSource.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINT_TOTALS:
      data = await countComplaintTotals.executeQuery(
        request.nickname,
        "",
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE:
      data = await countComplaintsByComplainantType.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE:
      data = await countMonthlyComplaintsByComplainantType.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_TOP_10_TAGS:
      data = await countTop10Tags.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_TOP_10_ALLEGATIONS:
      data = await countTop10Allegations.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.LOCATION_DATA:
      data = await locationDataQuery.executeQuery(
        dateRange,
        filterCaseByStatus
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_DISTRICT:
      data = await countComplaintsByDistrict.executeQuery(
        request.nickname,
        dateRange,
        filterCaseByStatus
      );
      break;
    default:
      return next(
        Boom.badRequest(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
      );
  }

  response.status(200).send(data);
});

export default getData;
