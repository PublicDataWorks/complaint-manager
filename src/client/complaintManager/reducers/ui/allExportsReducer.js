import {
  CLEAR_CURRENT_EXPORT_JOB,
  EXPORT_JOB_STARTED
} from "../../../../sharedUtilities/constants";

const initialState = {
  buttonsDisabled: false,
  showProgress: false
};

const allExportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPORT_JOB_STARTED:
      return { buttonsDisabled: true, showProgress: true };
    case CLEAR_CURRENT_EXPORT_JOB:
      return { buttonsDisabled: false, showProgress: false };
    default:
      return state;
  }
};

export default allExportsReducer;
