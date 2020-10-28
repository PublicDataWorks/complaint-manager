import { expectError } from "../../../../sharedTestHelpers/expectError";
import { validateDateRangeFields } from "./validateDateRangeFields";

describe("validateDateRangeFields", () => {
  const formLabel = "exportCases";

  test("Should not throw error when to and from values are provided", () => {
    const values = {
      [`${formLabel}From`]: "2012-01-01",
      [`${formLabel}To`]: "2019-01-01"
    };
    expect(validateDateRangeFields(values, formLabel)).toEqual(undefined);
  });

  test("Should throw error when to value is missing", () => {
    const values = {
      [`${formLabel}From`]: "2012-01-01"
    };
    expectError(() => validateDateRangeFields(values, formLabel), {
      errors: { [`${formLabel}To`]: "Please enter a date" }
    });
  });

  test("Should throw error when from value is missing", () => {
    const values = {
      [`${formLabel}To`]: "2012-01-01"
    };

    expectError(() => validateDateRangeFields(values, formLabel), {
      errors: { [`${formLabel}From`]: "Please enter a date" }
    });
  });

  test("Should throw dates out of order error when dates out of order", () => {
    const values = {
      [`${formLabel}From`]: "2019-01-01",
      [`${formLabel}To`]: "2012-01-01"
    };

    expectError(() => validateDateRangeFields(values, formLabel), {
      errors: {
        [`${formLabel}From`]: "From date cannot be after To date"
      }
    });
  });
});
