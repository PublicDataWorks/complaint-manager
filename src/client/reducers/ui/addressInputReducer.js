import {
  ADDRESS_DISPLAY_VALUE_UPDATED,
  ADDRESS_ERROR_MESSAGE_UPDATED,
  ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  ADDRESS_TO_CONFIRM_UPDATED,
  ADDRESS_VALIDITY_UPDATED
} from "../../../sharedUtilities/constants";

const initialState = {
  addressValid: true,
  addressMessageVisible: false,
  addressToConfirm: {},
  addressDisplayValue: "",
  addressErrorMessage: ""
};

const addressInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_VALIDITY_UPDATED:
      return { ...state, addressValid: action.addressValid };
    case ADDRESS_MESSAGE_VISIBILITY_UPDATED:
      return { ...state, addressMessageVisible: action.addressMessageVisible };
    case ADDRESS_TO_CONFIRM_UPDATED:
      return { ...state, addressToConfirm: action.addressToConfirm };
    case ADDRESS_DISPLAY_VALUE_UPDATED:
      return { ...state, addressDisplayValue: action.addressDisplayValue };
    case ADDRESS_ERROR_MESSAGE_UPDATED:
      return { ...state, addressErrorMessage: action.addressErrorMessage };
    default:
      return state;
  }
};

export default addressInputReducer;
