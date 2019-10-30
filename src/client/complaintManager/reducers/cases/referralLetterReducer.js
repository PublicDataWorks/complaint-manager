import {
  GET_REFERRAL_LETTER_PDF_SUCCESS,
  GET_REFERRAL_LETTER_PREVIEW_SUCCESS,
  GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS
} from "../../../../sharedUtilities/constants";

const initialState = {
  letterPdf: null,
  letterDetails: {},
  letterHtml: "",
  addresses: {},
  editStatus: null,
  lastEdited: null,
  finalFilename: null,
  draftFilename: null
};
const referralLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRAL_LETTER_SUCCESS:
      return { ...state, letterDetails: action.letterDetails };
    case GET_REFERRAL_LETTER_PREVIEW_SUCCESS:
      return {
        ...state,
        letterHtml: action.letterHtml,
        addresses: action.addresses,
        editStatus: action.editStatus,
        lastEdited: action.lastEdited,
        finalFilename: action.finalFilename,
        draftFilename: action.draftFilename
      };
    case GET_REFERRAL_LETTER_PDF_SUCCESS:
      return { ...state, letterPdf: action.letterPdf };
    case GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS:
      return { ...state, editStatus: action.editStatus };
    default:
      return state;
  }
};

export default referralLetterReducer;
