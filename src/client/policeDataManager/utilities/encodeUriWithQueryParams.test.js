import encodeUriWithQueryParams from "./encodeUriWithQueryParams";

describe("encodeUriWithQueryParams", () => {
  test("it builds encoded uri with the query params", () => {
    const queryParams = { search: "noipm stuff", sort: "inc" };
    const expectedUri = "http://www.google.com?search=noipm%20stuff&sort=inc";
    const actualUri = encodeUriWithQueryParams(
      "http://www.google.com",
      queryParams
    );
    expect(actualUri).toEqual(expectedUri);
  });

  test("it keeps the uri unchanged if no query params", () => {
    const queryParams = {};
    const expectedUri = "http://www.google.com";
    const actual = encodeUriWithQueryParams(
      "http://www.google.com",
      queryParams
    );
    expect(actual).toEqual(expectedUri);
  });
});
