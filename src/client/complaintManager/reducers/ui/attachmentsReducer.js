import {
  DROPZONE_FILE_REMOVED,
  DUPLICATE_FILE_DROPPED
} from "../../../../sharedUtilities/constants";

const initialState = {
  errorMessage: ""
};

const attachmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DUPLICATE_FILE_DROPPED:
      return {
        errorMessage: "File name already exists"
      };
    case DROPZONE_FILE_REMOVED:
      return {
        errorMessage: ""
      };
    default:
      return state;
  }
};

export default attachmentsReducer;
