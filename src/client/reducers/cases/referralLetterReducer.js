import {
  GET_REFERRAL_LETTER_SUCCESS,
  GET_LETTER_PREVIEW_SUCCESS,
  GET_LETTER_PDF_SUCCESS,
  GET_FINAL_PDF_URL_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {
  letterPdf: null,
  letterDetails: {},
  letterHtml: "",
  addresses: {},
  editHistory: {},
  finalPdfUrl: null
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
    case GET_LETTER_PDF_SUCCESS:
      return { ...state, letterPdf: action.letterPdf };
    case GET_FINAL_PDF_URL_SUCCESS:
      return {
        ...state,
        finalPdfUrl: action.finalPdfUrl
      };
    default:
      return state;
  }
};

export default referralLetterReducer;
