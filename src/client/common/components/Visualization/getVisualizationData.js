import axios from "axios";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { transformData as countTop10TagsTransformer } from "./Transformers/countTop10Tags";
import { transformData as countComplaintsByIntakeSourceTransformer } from "./Transformers/countComplaintsByIntakeSource";
import { transformData as countComplaintsByComplainantTypeTransformer } from "./Transformers/countComplaintsByComplainantType";
import { transformData as countComplaintsByComplainantTypePast12MonthsTransformer } from "./Transformers/countComplaintsByComplainantTypePast12Months";
import { transformData as locationDataTransformer } from "./Transformers/locationDataTransformer";

const transformers = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]:
    countComplaintsByIntakeSourceTransformer,
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]:
    countComplaintsByComplainantTypeTransformer,
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS]:
    countComplaintsByComplainantTypePast12MonthsTransformer,
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: countTop10TagsTransformer,
  [QUERY_TYPES.LOCATION_DATA]: locationDataTransformer
};

export const getVisualizationData = async ({
  queryType,
  isPublic = false,
  queryOptions = {}
}) => {
  const queryOptionParams = Object.keys(queryOptions)
    .map(key => `&${key}=${queryOptions[key]}`)
    .join("");

  const { data } = await axios.get(
    `/api/${
      isPublic ? "public-" : ""
    }data?queryType=${queryType}${queryOptionParams}`
  );

  const currentTransformer = transformers[queryType] || null;

  if (!currentTransformer) {
    throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }

  return currentTransformer(data);
};
