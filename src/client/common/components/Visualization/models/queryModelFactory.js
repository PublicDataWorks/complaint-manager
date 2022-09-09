import CountComplaintsByComplainantType from "./countComplaintsByComplainantType.model";
import CountComplaintsByDistrict from "./countComplaintsByDistrict.model";
import CountComplaintsByIntakeSource from "./countComplaintsByIntakeSource.model";
import CountMonthlyComplaintsByComplainantType from "./countMonthlyComplaintsByComplainantType.model";
import CountTop10Tags from "./countTop10Tags.model";
import CountTop10Allegations from "./countTop10Allegations.model";
import LocationData from "./locationData.model";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";

export const getQueryModelByQueryType = queryType => {
  switch (QUERY_TYPES[queryType]) {
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE:
      return new CountComplaintsByComplainantType();
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_DISTRICT:
      return new CountComplaintsByDistrict();
    case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
      return new CountComplaintsByIntakeSource();
    case QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE:
      return new CountMonthlyComplaintsByComplainantType();
    case QUERY_TYPES.COUNT_TOP_10_TAGS:
      return new CountTop10Tags();
    case QUERY_TYPES.COUNT_TOP_10_ALLEGATIONS:
      return new CountTop10Allegations();
    case QUERY_TYPES.LOCATION_DATA:
      return new LocationData();
    default:
      return null;
  }
};
