import caseTagsReducer from "./caseTagsReducer";
import {
  createCaseTagSuccess,
  getCaseTagSuccess
} from "../../actionCreators/casesActionCreators";

describe("caseTagsReducer", () => {
  test("should set default state", () => {
    const newState = caseTagsReducer(undefined, { type: "SOME_ACTION" });

    expect(newState).toEqual([]);
  });

  test("should return case tags array after successful get", () => {
    const expectedCaseTags = ["Penguin", "Osprey"];
    const newState = caseTagsReducer([], getCaseTagSuccess(expectedCaseTags));

    expect(newState).toEqual(expectedCaseTags);
  });

  test("should return case tags when creating a case tag", () => {
    const expectedCaseTags = ["Penguin", "Osprey"];

    const newState = caseTagsReducer(
      [],
      createCaseTagSuccess(expectedCaseTags)
    );
    expect(newState).toEqual(expectedCaseTags);
  });
});
