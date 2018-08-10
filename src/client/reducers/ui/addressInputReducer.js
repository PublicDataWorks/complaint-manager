import { ADDRESS_VALIDITY_UPDATED } from "../../../sharedUtilities/constants";

const initialState = {
  addressValid: true
};

const addressInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_VALIDITY_UPDATED:
      return { addressValid: action.addressValid };
    default:
      return state;
  }
};

export default addressInputReducer;
