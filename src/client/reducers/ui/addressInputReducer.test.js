import addressInputReducer from "./addressInputReducer";
import {
  updateAddressInputValidity,
  updateAddressToConfirm,
  updateShowAddressMessage
} from "../../actionCreators/casesActionCreators";

describe("addressInputDialogReducer", () => {
  test("should set default state", () => {
    const newState = addressInputReducer(undefined, { type: "any action" });

    expect(newState).toEqual({
      addressValid: true,
      addressMessageVisible: false,
      addressToConfirm: {}
    });
  });

  test("should set addressValid to given value", () => {
    const newState = addressInputReducer({}, updateAddressInputValidity(false));

    expect(newState).toEqual({
      addressValid: false
    });
  });

  test("should set addressMessageVisible to given value", () => {
    const newState = addressInputReducer(
      { addressValid: false, addressMessageVisible: false },
      updateShowAddressMessage(true)
    );

    expect(newState).toEqual({
      addressValid: false,
      addressMessageVisible: true
    });
  });

  test("should set addressToConfirm", () => {
    const newAddressToConfirm = {
      streetAddress: "123 main st",
      city: "chicago",
      state: "IL",
      zipCode: "60601",
      country: "US"
    };
    const newState = addressInputReducer(
      {
        addressValid: false,
        addressMessageVisible: false,
        addressToConfirm: {}
      },
      updateAddressToConfirm(newAddressToConfirm)
    );

    expect(newState).toEqual({
      addressValid: false,
      addressMessageVisible: false,
      addressToConfirm: newAddressToConfirm
    });
  });
});
