import { getResultsFromES } from "./getResultsFromES";
import elasticSearch from "@elastic/elasticsearch";

jest.mock("@elastic/elasticsearch");

const search = jest.fn();
elasticSearch.Client = jest.fn().mockImplementation(() => ({ search }));

describe("getResultsFromES", () => {
  test("should search for stuff", async () => {
    search.mockImplementation(() =>
      Promise.resolve({ body: { hits: { hits: [{ _source: "hi" }] } } })
    );

    const result = await getResultsFromES("query");

    expect(result).toEqual(["hi"]);
  });
});
