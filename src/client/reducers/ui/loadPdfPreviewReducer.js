import {
  FINISH_LOADING_PDF_PREVIEW,
  START_LOADING_PDF_PREVIEW
} from "../../../sharedUtilities/constants";

const initialState = {
  loadingPdfPreview: false
};

const letterDownloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case FINISH_LOADING_PDF_PREVIEW:
      return { ...state, loadingPdfPreview: false };
    case START_LOADING_PDF_PREVIEW:
      return { ...state, loadingPdfPreview: true };
    default:
      return state;
  }
};

export default letterDownloadReducer;
