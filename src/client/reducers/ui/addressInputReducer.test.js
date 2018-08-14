import addressInputReducer from "./addressInputReducer";
import {
  updateAddressDisplayValue,
  updateAddressErrorMessage,
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
      addressToConfirm: {},
      addressDisplayValue: "",
      addressErrorMessage: ""
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

  test("should set addressDisplayValue", () => {
    const newAddressDisplayValue = "123 main st, chicago IL, US";
    const newState = addressInputReducer(
      {
        addressValid: false,
        addressMessageVisible: false,
        addressToConfirm: {},
        addressDisplayValue: ""
      },
      updateAddressDisplayValue(newAddressDisplayValue)
    );

    expect(newState).toEqual({
      addressValid: false,
      addressMessageVisible: false,
      addressToConfirm: {},
      addressDisplayValue: "123 main st, chicago IL, US"
    });
  });

  test("should set addressErrorMessage", () => {
    const newAddressErrorMessage =
      "We could not find any matching addresses. Please enter a valid address.";
    const newState = addressInputReducer(
      {
        addressValid: false,
        addressMessageVisible: false,
        addressToConfirm: {},
        addressDisplayValue: "",
        addressErrorMessage: ""
      },
      updateAddressErrorMessage(newAddressErrorMessage)
    );

    expect(newState).toEqual({
      addressValid: false,
      addressMessageVisible: false,
      addressToConfirm: {},
      addressDisplayValue: "",
      addressErrorMessage:
        "We could not find any matching addresses. Please enter a valid address."
    });
  });
});
