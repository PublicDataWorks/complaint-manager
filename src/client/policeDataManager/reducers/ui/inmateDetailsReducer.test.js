import {
  CLEAR_SELECTED_INMATE,
  SET_SELECTED_INMATE
} from "../../../../sharedUtilities/constants";
import inmateDetailsReducer from "./inmateDetailsReducer";

describe("inmateDetailsReducer", () => {
  test("should have default state of {}", () => {
    expect(inmateDetailsReducer()).toEqual({});
  });

  test("should set inmate when passed in", () => {
    expect(
      inmateDetailsReducer(
        {},
        { type: SET_SELECTED_INMATE, payload: { hi: "mom" } }
      )
    ).toEqual({ hi: "mom" });
  });

  test("should reset inmate to {} when clear action is passed", () => {
    expect(
      inmateDetailsReducer({ hi: "mom" }, { type: CLEAR_SELECTED_INMATE })
    ).toEqual({});
  });

  test("should overwrite inmate to {} when set payload is undefined", () => {
    expect(
      inmateDetailsReducer({ hi: "mom" }, { type: SET_SELECTED_INMATE })
    ).toEqual({});
  });

  test("should ignore unrelated action type", () => {
    expect(
      inmateDetailsReducer(
        { hi: "mom" },
        {
          type: "SET_SELECTED_INMATE_WHO_WAS_SELECTED_BY_THE_SELECTION_COMMITTEE_FOR_THE_PURPOSE_OF_BEING_SELECTED",
          payload: { that: "seems excessive" }
        }
      )
    ).toEqual({ hi: "mom" });
  });
});
