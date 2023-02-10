import validateOfficerSearchForm from "./validateOfficerSearchForm";

const FIELDS = [
  { name: "firstName", isText: true },
  { name: "lastName", isText: true },
  { name: "districtId", isText: false }
];

describe("validateOfficerSearchForm", () => {
  test("should return error on first name and last name and district if all blank", () => {
    const values = {};
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please complete at least one field",
      lastName: "Please complete at least one field",
      districtId: "Please complete at least one field"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return no errors if one present with enough characters", () => {
    const values = { firstName: "pickles" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {};
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return no errors if district present", () => {
    const values = { districtId: 8 };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {};
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on first name field if first name less than 2 chars", () => {
    const values = { firstName: "a" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please enter at least two characters"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on last name field if last name less than 2 chars", () => {
    const values = { lastName: "a" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = { lastName: "Please enter at least two characters" };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on first name and last name if both present and less than 2 chars", () => {
    const values = { firstName: "a", lastName: "a" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please enter at least two characters",
      lastName: "Please enter at least two characters"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error when less than two characters excluding whitespace present", () => {
    const values = { firstName: "a " };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please enter at least two characters"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on first name when % present", () => {
    const values = { firstName: "%" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please note that % and _ are not allowed"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on last name when % present", () => {
    const values = { lastName: "%" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      lastName: "Please note that % and _ are not allowed"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on first name when _ present", () => {
    const values = { firstName: "_" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      firstName: "Please note that % and _ are not allowed"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });

  test("should return error on last name when _ present", () => {
    const values = { lastName: "_" };
    const actualErrors = validateOfficerSearchForm(FIELDS)(values);
    const expectedErrors = {
      lastName: "Please note that % and _ are not allowed"
    };
    expect(actualErrors).toEqual(expectedErrors);
  });
});
