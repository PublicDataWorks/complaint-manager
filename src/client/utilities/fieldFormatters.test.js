import { trimWhitespace, numbersOnly } from "./fieldFormatters";

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

  describe("numbersOnly", () => {
    test("strips out non numbers", () => {
      const result = numbersOnly("9a");
      expect(result).toEqual("9");
    });

    test("returns empty string if null", () => {
      const result = numbersOnly(null);
      expect(result).toEqual("");
    });

    test("allows numeric values", () => {
      const result = numbersOnly(98);
      expect(result).toEqual(98);
    });
  });
});
