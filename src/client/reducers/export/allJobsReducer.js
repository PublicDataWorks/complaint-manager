import {
  CLEAR_CURRENT_EXPORT_JOB,
  GET_EXPORT_JOB_SUCCESS
} from "../../../sharedUtilities/constants";

const allJobsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_EXPORT_JOB_SUCCESS:
      return { exportJob: action.exportJob };
    case CLEAR_CURRENT_EXPORT_JOB:
      return { exportJob: {} };
    default:
      return state;
  }
};

export default allJobsReducer;
