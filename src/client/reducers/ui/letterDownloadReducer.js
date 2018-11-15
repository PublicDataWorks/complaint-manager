import {
  START_LETTER_DOWNLOAD,
  STOP_LETTER_DOWNLOAD
} from "../../../sharedUtilities/constants";

const initialState = {
  downloadInProgress: false
};

const letterDownloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOP_LETTER_DOWNLOAD:
      return { ...state, downloadInProgress: false };
    case START_LETTER_DOWNLOAD:
      return { ...state, downloadInProgress: true };
    default:
      return state;
  }
};

export default letterDownloadReducer;
