import { GET_CLASSIFICATIONS_SUCCEEDED } from "../../../sharedUtilities/constants";
import classificationReducer from "./classificationReducer";
import { getClassificationsSuccess } from "../../actionCreators/classificationActionCreators";

describe("classificationReducer", () => {
  describe("GET_CLASSIFICATIONS_SUCCEEDED", () => {
    test("should initialize to blank array", () => {
      const newState = classificationReducer(undefined, { type: "SOMETHING" });
      expect(newState).toEqual([]);
    });

    test("should set given classifications on state", () => {
      const newClassifications = [[0, "UTD"], [1, "BWC"]];
      const newState = classificationReducer(
        undefined,
        getClassificationsSuccess(newClassifications)
      );
      expect(newState).toEqual(newClassifications);
    });
  });
});
