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

  test("should handle error if initializing elastic search fails", async () => {
    elasticSearch.Client = jest.fn().mockImplementation(() => {
      throw new Error("error");
    });
    try {
      await getResultsFromES("query");
      expect.fail("failed to throw error");
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  test("shoudl throw an error if search throws an error", async () => {
    search.mockImplementation(() => Promise.reject(new Error("error")));
    try {
      await getResultsFromES("query");
      expect.fail("failed to throw error");
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });
});
