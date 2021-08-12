const { parseSearchTerm, buildQueryString } = require("./searchUtilities");

describe("parseSearchTerm", () => {
  test("should return undefined if input is undefined", () => {
    expect(parseSearchTerm()).toBeUndefined();
    expect(parseSearchTerm(null)).toBeUndefined();
  });

  test("should return unchanged term when term has no spaces", () => {
    expect(parseSearchTerm("Seizure")).toEqual("Seizure");
    expect(parseSearchTerm("HeLlO!!")).toEqual("HeLlO!!");
  });

  test('should replace all spaces with " <<SPACE>> "', () => {
    expect(parseSearchTerm(" Search")).toEqual(" <<SPACE>> Search");
    expect(parseSearchTerm("Search ")).toEqual("Search <<SPACE>> ");
    expect(parseSearchTerm("Search and Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
    expect(parseSearchTerm("Search      and       Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
  });

  describe("buildQueryString", () => {
    test("should asterisk all words if no operators, parens, or quotes", () => {
      expect(
        buildQueryString("I like tea and cakes for tea and cake time")
      ).toEqual(
        "*I* *like* *tea* *and* *cakes* *for* *tea* *and* *cake* *time*"
      );
    });

    test("should not asterisk operators", () => {
      expect(
        buildQueryString("I like tea AND cakes for tea OR cake time")
      ).toEqual("*I* *like* *tea* AND *cakes* *for* *tea* OR *cake* *time*");
    });

    test("should not asterisk quotes", () => {
      expect(
        buildQueryString('I "like tea" AND cakes for tea OR "cake time"')
      ).toEqual(
        '*I* "like* *<<SPACE>>* *tea" AND *cakes* *for* *tea* OR "cake* *<<SPACE>>* *time"'
      );
    });

    test("should add parens around NOT and next term", () => {
      expect(buildQueryString("NOT safe")).toEqual("(NOT *safe*)");
      expect(buildQueryString("NOT safe AND definitely NOT SAFe")).toEqual(
        "(NOT *safe*) AND *definitely* (NOT *SAFe*)"
      );
    });

    test("should not asterisk parens or a NOT just inside of parens", () => {
      expect(
        buildQueryString("I like (tea AND cakes for) (NOT tea OR cake) time")
      ).toEqual(
        "*I* *like* (tea* AND *cakes* *for) ((NOT *tea*) OR *cake) *time*"
      );
    });
  });
});
