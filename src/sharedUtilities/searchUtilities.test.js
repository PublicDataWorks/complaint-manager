const { parseSearchTerm } = require("./searchUtilities");

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
});
