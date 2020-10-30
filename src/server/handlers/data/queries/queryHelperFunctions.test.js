import { getComplainantType, getDateRangeStart } from "./queryHelperFunctions";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";

describe("queryHelperFunctions", () => {
  describe("getComplainantType", () => {
    test("should return Civilian (CC) based on civilian/default person type case reference", () => {
      const caseReference = "CC2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Civilian (CC)");
    });

    test("should return Police Officer (PO) prefix based on known/unknown officer person type case reference", () => {
      const caseReference = "PO2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Police Officer (PO)");
    });

    test("should return CN prefix based on civilian within nopd personType case reference", () => {
      const caseReference = "CN2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Civilian Within NOPD (CN)");
    });

    test("should return AC prefix given anonymized primary complainant case reference", () => {
      const caseReference = "AC2019-0001";
      const result = getComplainantType(caseReference);

      expect(result).toEqual("Anonymous (AC)");
    });
  });

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

    const dateRangeStart = getDateRangeStart(DATE_RANGE_TYPE.YTD, currentDate);

    expect(dateRangeStart.toDate()).toEqual(expectedRangeStart);
  });
    test("should return a YTD start for filtering queries when no range type is passed", () => {
        const currentDate = new Date(2020, 9, 28);
        const expectedRangeStart = new Date(2020, 0, 1);

        const dateRangeStart = getDateRangeStart(undefined, currentDate);

        expect(dateRangeStart.toDate()).toEqual(expectedRangeStart);
    });

  test("should return a an error for invalid date range types", () => {
    expect(() => {
      getDateRangeStart("INVALID_OPTION");
    }).toThrow(BAD_REQUEST_ERRORS.INVALID_DATE_RANGE_TYPE);
  });
});
