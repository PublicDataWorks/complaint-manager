import { QUERY_TYPES } from "../../../../sharedUtilities/constants";

export const configs = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    responsive: false,
    useResizeHandler: false
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    responsive: false,
    useResizeHandler: false
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    responsive: false,
    useResizeHandler: false
  }
};

export const getVisualizationConfig = queryType => configs[queryType] || {};
