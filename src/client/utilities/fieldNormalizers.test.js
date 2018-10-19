import { nullifyFieldUnlessValid, trimWhiteSpace } from "./fieldNormalizers";

describe("fieldNormalizers", () => {
  describe("trimWhiteSpace", () => {
    test("should return empty string if all spaces", () => {
      const normalizedValue = trimWhiteSpace("    ");
      expect(normalizedValue).toEqual("");
    });
    test("should return value with side white space removed", () => {
      const normalizedValue = trimWhiteSpace(" one two ");
      expect(normalizedValue).toEqual("one two");
    });
  });

  describe("nullifyFieldUnlessValid", () => {
    test("should nullify an empty string", () => {
      const normalizedValue = nullifyFieldUnlessValid("");

      expect(normalizedValue).toBeNull();
    });

    test("should nullify a whitespace", () => {
      const normalizedValue = nullifyFieldUnlessValid(" ");

      expect(normalizedValue).toBeNull();
    });

    test("should not nullify a number", () => {
      const normalizedValue = nullifyFieldUnlessValid(8);

      expect(normalizedValue).toEqual(8);
    });

    test("should not nullify a boolean", () => {
      const normalizedValue = nullifyFieldUnlessValid(false);

      expect(normalizedValue).toEqual(false);
    });

    test("should not nullify non blank or non whitespace input", () => {
      const normalizedValue = nullifyFieldUnlessValid("2018-01-01");

      expect(normalizedValue).toEqual("2018-01-01");
    });
  });
});
