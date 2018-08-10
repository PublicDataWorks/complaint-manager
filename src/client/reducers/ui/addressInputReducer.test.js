import addressInputReducer from "./addressInputReducer";
import { updateAddressInputValidity } from "../../actionCreators/casesActionCreators";

describe("addressInputDialogReducer", () => {
  test("should set default state", () => {
    const newState = addressInputReducer(undefined, { type: "any action" });

    expect(newState).toEqual({
      addressValid: true
    });
  });

  test("should set addressValid to given value", () => {
    const newState = addressInputReducer({}, updateAddressInputValidity(false));

    expect(newState).toEqual({
      addressValid: false
    });
  });
});
