import {
  GET_REFERRAL_LETTER_SUCCESS,
  EDIT_REFERRAL_LETTER_SUCCESS,
  EDIT_IAPRO_CORRECTION_SUCCESS,
  EDIT_RECOMMENDED_ACTIONS_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = { letterDetails: {}, letterHtml: "" };
const referralLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRAL_LETTER_SUCCESS:
    case EDIT_REFERRAL_LETTER_SUCCESS:
    case EDIT_IAPRO_CORRECTION_SUCCESS:
    case EDIT_RECOMMENDED_ACTIONS_SUCCESS:
      return { ...state, letterDetails: action.letterDetails };
    case GET_LETTER_PREVIEW_SUCCESS:
      return { ...state, letterHtml: action.letterHtml };
    default:
      return state;
  }
};

export default referralLetterReducer;
