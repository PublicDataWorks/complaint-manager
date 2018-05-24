import validateAllegationSearchForm from "./validateAllegationSearchForm";

describe("validateAllegationOfficerSearchForm", () => {
  test("should return error if rule or directive not selected", () => {
    const values = {};
    const actualErrors = validateAllegationSearchForm(values);
    const expectedErrors = {
      rule: "Please complete at least one field",
      paragraph: "Please complete at least one field",
      directive: "Please complete at least one field"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on directive if value is < 2 characters", () => {
    const values = { directive: "a" };
    const actualErrors = validateAllegationSearchForm(values);
    const expectedErrors = {
      directive: "Please enter at least two characters"
    };

    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error if % present in directive field", () => {
    const values = { directive: "%" };
    const actualErrors = validateAllegationSearchForm(values);
    const expectedErrors = {
      directive: "Please note that % and _ are not allowed"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });
});
