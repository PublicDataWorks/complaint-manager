import { getComplainantType, getDateRangeStart } from "./queryHelperFunctions";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import moment from "moment";
const {
  PD,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("queryHelperFunctions", () => {
  describe("getComplainantType", () => {
    test("should return Civilian (CC) based on civilian/default person type case reference", () => {
      const caseReference = `${PERSON_TYPE.CIVILIAN.abbreviation}2019-0001`;
      const result = getComplainantType(caseReference);

      expect(result).toEqual(PERSON_TYPE.CIVILIAN.complainantLegendValue);
    });

    test("should return appropriate prefix based on known/unknown officer person type case reference", () => {
      const caseReference = `${PERSON_TYPE.KNOWN_OFFICER.abbreviation}2019-0001`;
      const result = getComplainantType(caseReference);

      expect(result).toEqual(PERSON_TYPE.KNOWN_OFFICER.complainantLegendValue);
    });

    test("should return appropriate prefix based on civilian within pd personType case reference", () => {
      const caseReference = `${PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation}2019-0001`;
      const result = getComplainantType(caseReference);

      expect(result).toEqual(
        PERSON_TYPE.CIVILIAN_WITHIN_PD.complainantLegendValue
      );
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
