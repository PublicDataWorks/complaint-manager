import {
  GET_REFERRAL_LETTER_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {
  letterDetails: {},
  letterHtml: "",
  addresses: {},
  editHistory: { edited: false }
};
const referralLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRAL_LETTER_SUCCESS:
      return { ...state, letterDetails: action.letterDetails };
    case GET_LETTER_PREVIEW_SUCCESS:
      return {
        ...state,
        letterHtml: action.letterHtml,
        addresses: action.addresses,
        editHistory: action.editHistory
      };
    default:
      return state;
  }
};

export default referralLetterReducer;
