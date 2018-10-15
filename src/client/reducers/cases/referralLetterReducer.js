import {
  GET_REFERRAL_LETTER_SUCCESS,
  EDIT_REFERRAL_LETTER_SUCCESS,
  EDIT_IAPRO_CORRECTION_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = { letterDetails: {} };
const referralLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRAL_LETTER_SUCCESS:
    case EDIT_REFERRAL_LETTER_SUCCESS:
    case EDIT_IAPRO_CORRECTION_SUCCESS:
      return { ...state, letterDetails: action.letterDetails };
    default:
      return state;
  }
};

export default referralLetterReducer;
