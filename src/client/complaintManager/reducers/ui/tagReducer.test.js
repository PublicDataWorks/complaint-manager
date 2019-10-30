import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import tagReducer from "./tagReducer";

describe("tagReducer", () => {
  test("should initialize to blank array", () => {
    const newState = tagReducer(undefined, { type: "SOMETHING" });

    expect(newState).toEqual([]);
  });

  test("should set given tags in state", () => {
    const tags = [["Audrey", 0], ["Tofu", 1], ["Tom", 2]];

    const newState = tagReducer(undefined, getTagsSuccess(tags));

    expect(newState).toEqual(tags);
  });
});
