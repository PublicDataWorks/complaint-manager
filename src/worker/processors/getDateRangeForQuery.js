import moment from "moment-timezone";
import { TIMEZONE } from "../../sharedUtilities/constants";

const getDateRangeForQuery = dateRange => {
  return {
    exportStartDateAndTime: moment
      .utc(
        moment
          .tz(dateRange.exportStartDate, TIMEZONE)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
      )
      .toDate(),
    exportEndDateAndTime: moment
      .utc(
        moment
          .tz(dateRange.exportEndDate, TIMEZONE)
          .hour(23)
          .minute(59)
          .second(59)
          .millisecond(999)
      )
      .toDate()
  };
};

export default getDateRangeForQuery;
