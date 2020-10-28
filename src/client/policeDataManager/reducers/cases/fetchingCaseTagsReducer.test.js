import fetchingCaseTagsReducer from "./fetchingCaseTagsReducer";
import { fetchingCaseTags } from "../../actionCreators/casesActionCreators";

describe("fetchingCaseNotesReducer", () => {
  test("should set default state", () => {
    const newState = fetchingCaseTagsReducer(undefined, {
      type: "SOME_ACTION"
    });

    expect(newState).toEqual([]);
  });

  test("should return fetching for case notes as true", () => {
    const newState = fetchingCaseTagsReducer([], fetchingCaseTags(true));

    expect(newState).toEqual(true);
  });

  test("should return fetching for case notes as false", () => {
    const newState = fetchingCaseTagsReducer([], fetchingCaseTags(false));

    expect(newState).toEqual(false);
  });
});
