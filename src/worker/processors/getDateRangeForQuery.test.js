import moment from "moment-timezone";
import { TIMEZONE } from "../../sharedUtilities/constants";
import getDateRangeForQuery from "./getDateRangeForQuery";

describe("getDateRangeForQuery", () => {
  test("returns dates and times starting at beginning of day and ending at end of day in utc", () => {
    const dateRange = {
      exportStartDate: "2000-02-19",
      exportEndDate: "2000-02-21"
    };

    const dateAndTimeRangeForQuery = getDateRangeForQuery(dateRange);

    expect(dateAndTimeRangeForQuery).toEqual({
      exportStartDateAndTime: moment
        .utc(moment.tz("2000-02-19 00:00:00.000", TIMEZONE))
        .toDate(),
      exportEndDateAndTime: moment
        .utc(moment.tz("2000-02-21 23:59:59.999", TIMEZONE))
        .toDate()
    });
  });
});
