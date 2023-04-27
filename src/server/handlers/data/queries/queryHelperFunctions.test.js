import {
  calculateFirstContactDateCriteria,
  getComplainantType,
  getDateRangeStart
} from "./queryHelperFunctions";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import sequelize from "sequelize";
import moment from "moment";

describe("queryHelperFunctions", () => {
  describe("getDateRangeStart", () => {
    test("should return a start date for filtering queries based on past 12 months range option", () => {
      const currentDate = new Date(2020, 9, 28);
      const expectedRangeStart = new Date(2019, 9, 28);

      const dateRangeStart = getDateRangeStart(
        DATE_RANGE_TYPE.PAST_12_MONTHS,
        currentDate
      );

      expect(dateRangeStart.toDate()).toEqual(expectedRangeStart);
    });

    test("should return a start date for filtering queries based on YTD range option", () => {
      const currentDate = new Date(2020, 9, 28);
      const expectedRangeStart = new Date(2020, 0, 1);

      const dateRangeStart = getDateRangeStart(
        DATE_RANGE_TYPE.YTD,
        currentDate
      );

      expect(dateRangeStart.toDate()).toEqual(expectedRangeStart);
    });
    test("should return a YTD start for filtering queries when no range type is passed", () => {
      const currentDate = new Date(2020, 9, 28);
      const expectedRangeStart = new Date(2020, 0, 1);

      const dateRangeStart = getDateRangeStart(undefined, currentDate);

      expect(dateRangeStart.toDate()).toEqual(expectedRangeStart);
    });

    test("should return an error for invalid date range types", () => {
      expect(() => {
        getDateRangeStart("INVALID_OPTION");
      }).toThrow(BAD_REQUEST_ERRORS.INVALID_DATE_RANGE_TYPE);
    });
  });

  describe("calculateFirstContactDateCriteria", () => {
    test("should give a date range of YTD when nothing is specified", () => {
      expect(
        calculateFirstContactDateCriteria()[sequelize.Op.gte].format(
          "YYYY-MM-DD"
        )
      ).toEqual(moment().dayOfYear(1).format("YYYY-MM-DD"));
    });

    test("should use the default minDate when no minDate is used", () => {
      expect(
        calculateFirstContactDateCriteria({}, "1995-01-01T05:45:00.000Z")
      ).toEqual({
        [sequelize.Op.gte]: "1995-01-01T05:45:00.000Z"
      });
    });
  });
});
