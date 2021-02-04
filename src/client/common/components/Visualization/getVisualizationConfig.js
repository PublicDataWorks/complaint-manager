import { QUERY_TYPES } from "../../../../sharedUtilities/constants";

export const configs = {
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE]: {
    responsive: true,
    useResizeHandler: true
  },
  [QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE]: {
    responsive: true,
    useResizeHandler: true
  },
  [QUERY_TYPES.COUNT_TOP_10_TAGS]: {
    responsive: true,
    useResizeHandler: true      
  }
};

export const getVisualizationConfig = queryType => configs[queryType] || {};
