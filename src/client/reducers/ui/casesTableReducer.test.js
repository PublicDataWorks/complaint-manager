import casesTableReducer from "./casesTableReducer";
import { updateSort } from "../../actionCreators/casesActionCreators";

describe("casesTableReducer", () => {
  test("should set default state", () => {
    const newState = casesTableReducer(undefined, { type: "any action" });

    expect(newState).toEqual({ sortBy: "id", sortDirection: "desc" });
  });

  describe("SORT_UPDATED", () => {
    test("should update sortBy when given new sortBy", () => {
      const newSortBy = "someKey";
      const oldState = {
        sortBy: "id",
        sortDirection: "desc"
      };

      const newState = casesTableReducer(oldState, updateSort(newSortBy));
      expect(newState.sortBy).toEqual(newSortBy);
    });

    test("should toggle direction when sortBy is the same", () => {
      const newSortBy = "someKey";
      const oldState = {
        sortBy: "someKey",
        sortDirection: "asc"
      };

      const newState = casesTableReducer(oldState, updateSort(newSortBy));
      expect(newState.sortDirection).toEqual("desc");
    });

    test("should toggle direction when sortBy is the same", () => {
      const newSortBy = "someKey";
      const oldState = {
        sortBy: "someKey",
        sortDirection: "desc"
      };

      const newState = casesTableReducer(oldState, updateSort(newSortBy));
      expect(newState.sortDirection).toEqual("asc");
    });

    test("should default to ascending order when updating sortBy", () => {
      const newSortBy = "someKey";
      const oldState = {
        sortBy: "id",
        sortDirection: "desc"
      };

      const newState = casesTableReducer(oldState, updateSort(newSortBy));
      expect(newState.sortDirection).toEqual("asc");
    });
  });
});
