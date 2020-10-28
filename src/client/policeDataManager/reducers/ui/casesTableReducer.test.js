import casesTableReducer from "./casesTableReducer";
import { updateSort } from "../../actionCreators/casesActionCreators";
import {
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";

describe("casesTableReducer", () => {
  test("should set default state", () => {
    const oldState = undefined;

    const newState = casesTableReducer(oldState, { type: "ACTION" });

    expect(newState).toEqual({
      sortBy: SORT_CASES_BY.CASE_REFERENCE,
      sortDirection: DESCENDING
    });
  });

  describe("SORT_UPDATED", () => {
    test("should update sortBy and sortDirection when given new sortBy", () => {
      const expectedState = { sortBy: "someKey", sortDirection: "direction" };
      const oldState = {
        sortBy: "caseReference",
        sortDirection: "desc"
      };

      const newState = casesTableReducer(
        oldState,
        updateSort("someKey", "direction")
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
