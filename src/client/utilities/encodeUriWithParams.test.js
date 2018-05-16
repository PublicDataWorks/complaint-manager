import encodeUriWithParams from "./encodeUriWithParams";

describe("encodeUriWithParams", () => {
  test("it builds encoded uri with the query params", () => {
    const queryParams = { search: "noipm stuff", sort: "inc" };
    const expectedUri = "http://www.google.com?search=noipm%20stuff&sort=inc";
    const actualUri = encodeUriWithParams("http://www.google.com", queryParams);
    expect(actualUri).toEqual(expectedUri);
  });
});
