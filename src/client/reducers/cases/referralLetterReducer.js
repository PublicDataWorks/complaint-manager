import {
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS,
  GET_LETTER_TYPE_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {
  letterPdf: null,
  letterDetails: {},
  letterHtml: "",
  addresses: {},
  letterType: null,
  lastEdited: null,
  finalFilename: null,
  draftFilename: null
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
        letterType: action.letterType,
        lastEdited: action.lastEdited,
        finalFilename: action.finalFilename,
        draftFilename: action.draftFilename
      };
    case GET_LETTER_PDF_SUCCESS:
      return { ...state, letterPdf: action.letterPdf };
    case GET_LETTER_TYPE_SUCCESS:
      return { ...state, letterType: action.letterType };
    default:
      return state;
  }
};

export default referralLetterReducer;
