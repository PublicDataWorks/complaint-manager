import formatTags from "./formatTags";

describe("formatTags", () => {
  test("should format Tags", () => {
    const validTags = ["Apple", "Banana", "Carrot"];
    const formattedTags = formatTags(validTags);
    const expectedFormat = "Apple, Banana, Carrot";
    expect(formattedTags).toEqual(expectedFormat);
  });
});
