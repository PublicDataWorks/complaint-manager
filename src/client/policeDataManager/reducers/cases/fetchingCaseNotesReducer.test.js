import fetchingCaseNotesReducer from "./fetchingCaseNotesReducer";
import { fetchingCaseNotes } from "../../actionCreators/casesActionCreators";

describe("fetchingCaseNotesReducer", () => {
  test("should set default state", () => {
    const newState = fetchingCaseNotesReducer(undefined, {
      type: "SOME_ACTION"
    });

    expect(newState).toEqual([]);
  });

  test("should return fetching for case notes as true", () => {
    const newState = fetchingCaseNotesReducer([], fetchingCaseNotes(true));

    expect(newState).toEqual(true);
  });

  test("should return fetching for case notes as false", () => {
    const newState = fetchingCaseNotesReducer([], fetchingCaseNotes(false));

    expect(newState).toEqual(false);
  });
});
