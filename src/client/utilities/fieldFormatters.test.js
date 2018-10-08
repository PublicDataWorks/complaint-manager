import { trimWhitespace } from "./fieldFormatters";

describe("fieldFormatters", () => {
  describe("trimWhitespace", () => {
    test("returns empty string if null", () => {
      const result = trimWhitespace(null);
      expect(result).toEqual("");
    });
    test("returns trimmed value if value", () => {
      const result = trimWhitespace(" lj ");
      expect(result).toEqual("lj");
    });
    test("returns number if number", () => {
      const result = trimWhitespace(9);
      expect(result).toEqual(9);
    });
  });
});
