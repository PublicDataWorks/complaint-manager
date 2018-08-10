import {
  ADDRESS_VALIDITY_UPDATED,
  ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  ADDRESS_TO_CONFIRM_UPDATED
} from "../../../sharedUtilities/constants";

const initialState = {
  addressValid: true,
  addressMessageVisible: false,
  addressToConfirm: {}
};

const addressInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_VALIDITY_UPDATED:
      return { ...state, addressValid: action.addressValid };
    case ADDRESS_MESSAGE_VISIBILITY_UPDATED:
      return { ...state, addressMessageVisible: action.addressMessageVisible };
    case ADDRESS_TO_CONFIRM_UPDATED:
      return { ...state, addressToConfirm: action.addressToConfirm };
    default:
      return state;
  }
};

export default addressInputReducer;
