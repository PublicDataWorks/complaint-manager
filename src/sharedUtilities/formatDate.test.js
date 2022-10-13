import formatDate, {
  applyCentralTimeZoneOffset,
  computeTimeZone,
  dateTimeFromString,
  format12HourTime,
  formatShortDate,
  timeFromDateString
} from "./formatDate";
import { TIMEZONE } from "../sharedUtilities/constants";

describe("format date", () => {
  test("should format date appropriately when in YYYY-MM-DD format", () => {
    const formattedDate = formatDate("2018-01-30");

    expect(formattedDate).toEqual("Jan 30, 2018");
  });

  test("time in utc that converts to same day in central time", () => {
    const dateString = new Date("2018-10-31 16:20:01.913000Z");
    const formattedDate = formatDate(dateString);

    expect(formattedDate).toEqual("Oct 31, 2018");
  });

  test("time in utc that converts to previous day central time", () => {
    const dateString = new Date("2017-01-31 01:20:01.913000Z");
    const formattedDate = formatDate(dateString);

    expect(formattedDate).toEqual("Jan 30, 2017");
  });
});

describe("format short date", () => {
  test("should format date appropriately when in YYYY-MM-DD format", () => {
    const formattedDate = formatShortDate("2018-01-30");

    expect(formattedDate).toEqual("01/30/2018");
  });

  test("time in utc that converts to same day in central time", () => {
    const dateString = new Date("2018-10-31 16:20:01.913000Z");
    const formattedDate = formatShortDate(dateString);

    expect(formattedDate).toEqual("10/31/2018");
  });

  test("time in utc that converts to previous day central time", () => {
    const dateString = new Date("2017-01-31 01:20:01.913000Z");
    const formattedDate = formatShortDate(dateString);

    expect(formattedDate).toEqual("01/30/2017");
  });
});

describe("dateTimeFromString", () => {
  test("should format date time in cst", () => {
    const givenDateTime = "2018-09-17T19:56:06.401Z";
    const expectedTime = "Sep 17, 2018 2:56 PM CDT";
    expect(dateTimeFromString(givenDateTime, TIMEZONE)).toEqual(expectedTime);
  });

  test("should format date time in cdt", () => {
    const givenDateTime = "2018-01-17T19:56:06.401Z";
    const expectedTime = "Jan 17, 2018 1:56 PM CST";
    expect(dateTimeFromString(givenDateTime)).toEqual(expectedTime);
  });
});

describe("time from dateString", () => {
  test("should extract time from date", () => {
    const otherDateString = new Date("2018-01-31T06:00Z").toUTCString();
    const time = timeFromDateString(otherDateString);
    const expectedTime = "12:00 AM CST";
    expect(time).toEqual(expectedTime);
  });

  test("should not extract time and return null when invalid date", () => {
    const otherDateString = null;
    const time = timeFromDateString(otherDateString);
    const expectedTime = null;
    expect(time).toEqual(expectedTime);
  });
});

describe("apply CST to dateString", () => {
  test("should apply central timezone offset", () => {
    const otherDateString = new Date("2018-01-31T06:00Z").toUTCString();
    const offsettedDatestring = applyCentralTimeZoneOffset(otherDateString);
    const expectedDateString = "2018-01-31T00:00:00-06:00";
    expect(offsettedDatestring).toEqual(expectedDateString);
  });
});

describe("format12HourTime", () => {
  test("should return formatted time with single digit hour", () => {
    const time = "3:00:00";

    expect(format12HourTime(time)).toEqual("03:00 AM");
  });

  test("should format 24 hour time correctly", () => {
    const time = "23:59";

    expect(format12HourTime(time)).toEqual("11:59 PM");
  });
});
