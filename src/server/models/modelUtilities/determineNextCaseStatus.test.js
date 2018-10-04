import { CASE_STATUS } from "../../../sharedUtilities/constants";

const determineNextCaseStatus = require("./determineNextCaseStatus");

describe("determineNextCaseStatus", () => {
  test("should return initial when undefined", () => {
    const result = determineNextCaseStatus(undefined);
    expect(result).toEqual(CASE_STATUS.INITIAL);
  });

  test("should return the Active when passed Initial", () => {
    const result = determineNextCaseStatus(CASE_STATUS.INITIAL);
    expect(result).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should return the Letter in Progress  when passed Active", () => {
    const result = determineNextCaseStatus(CASE_STATUS.ACTIVE);
    expect(result).toEqual(CASE_STATUS.LETTER_IN_PROGRESS);
  });

  test("should return the Ready for Review  when passed Letter in Progress", () => {
    const result = determineNextCaseStatus(CASE_STATUS.LETTER_IN_PROGRESS);
    expect(result).toEqual(CASE_STATUS.READY_FOR_REVIEW);
  });

  test("should return the Forwarded to Agency  when passed Ready for Review", () => {
    const result = determineNextCaseStatus(CASE_STATUS.READY_FOR_REVIEW);
    expect(result).toEqual(CASE_STATUS.FORWARDED_TO_AGENCY);
  });

  test("should return the Closed  when passed Ready for Forwarded to Agency", () => {
    const result = determineNextCaseStatus(CASE_STATUS.FORWARDED_TO_AGENCY);
    expect(result).toEqual(CASE_STATUS.CLOSED);
  });

  test("should return null  when passed Closed", () => {
    const result = determineNextCaseStatus(CASE_STATUS.CLOSED);
    expect(result).toEqual(null);
  });
});
