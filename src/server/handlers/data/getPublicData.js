import asyncMiddleware from "../asyncMiddleware";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as countComplaintTotals from "./queries/countComplaintTotals";
import * as countComplaintsByComplainantType from "./queries/countComplaintsByComplainantType";
import * as countComplaintsByComplainantTypePast12Months from "./queries/countComplaintsByComplainantTypePast12Months";
import * as countTop10Tags from "./queries/countTop10Tags";
import * as locationDataQuery from "./queries/locationData";

const getPublicData = asyncMiddleware(async (request, response, next) => {
  let data;
  const queryType = request.query.queryType;
  const dateRangeType = request.query.dateRangeType;

  switch (queryType) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      data = await countComplaintsByIntakeSource.executeQuery(
        request.nickname,
        dateRangeType
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINT_TOTALS:
      data = await countComplaintTotals.executeQuery(request.nickname);
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE:
      data = await countComplaintsByComplainantType.executeQuery(
        request.nickname,
        dateRangeType
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS:
      data = await countComplaintsByComplainantTypePast12Months.executeQuery(
        request.nickname
      );
      break;
    case QUERY_TYPES.COUNT_TOP_10_TAGS:
      data = await countTop10Tags.executeQuery(request.nickname);
      break;
    case QUERY_TYPES.LOCATION_DATA:
      data = await locationDataQuery.executeQuery(request.query.minDate);
      break;
    default:
      return next(
        Boom.badRequest(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
      );
  }

  response.status(200).send(data);
});

export default getPublicData;
