import {
  CLEAR_CURRENT_EXPORT_JOB,
  GET_EXPORT_JOB_SUCCESS
} from "../../../sharedUtilities/constants";

const exportJobReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_EXPORT_JOB_SUCCESS:
      return action.exportJob;
    case CLEAR_CURRENT_EXPORT_JOB:
      return {};
    default:
      return state;
  }
};

export default exportJobReducer;
