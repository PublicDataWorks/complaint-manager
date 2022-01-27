import axios from "axios";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getQueryModelByQueryType } from "./models/queryModelFactory";

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

  const currentTransformer =
    getQueryModelByQueryType(queryType)?.transformData || null;

  if (!currentTransformer) {
    throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }

  return currentTransformer(data);
};
