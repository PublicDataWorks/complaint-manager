import axios from "axios";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import * as countTop10Tags from "./Transformers/countTop10Tags";
import * as countComplaintsByIntakeSource from "./Transformers/countComplaintsByIntakeSource";
import * as countComplaintsByComplainantType from "./Transformers/countComplaintsByComplainantType";
import * as countComplaintsByComplainantTypePast12Months from "./Transformers/countComplaintsByComplainantTypePast12Months";

export const getVisualizationData = async queryType => {
  let response, transformedData;
  switch (queryType) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      response = fetchData(queryType);
      transformedData = countComplaintsByIntakeSource.transformData(
        response.data
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE:
      response = fetchData(queryType);
      transformedData = countComplaintsByComplainantType.transformData(
        response.data
      );
      break;
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS:
      response = fetchData(queryType);
      transformedData = countComplaintsByComplainantTypePast12Months.transformData(
        response.data
      );
      break;
    case QUERY_TYPES.COUNT_TOP_10_TAGS:
      response = fetchData(queryType);
      transformedData = countTop10Tags.transformData(response.data);
      break;
    default:
      throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }
  return transformedData;
};

const fetchData = async queryType => {
  return await axios.get(`/api/data?queryType=${queryType}`);
};
