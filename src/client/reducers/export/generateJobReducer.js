import {
  CLEAR_CURRENT_EXPORT_JOB,
  GENERATE_EXPORT_SUCCESS
} from "../../../sharedUtilities/constants";

const generateJobReducer = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_EXPORT_SUCCESS:
      return action.jobId;
    case CLEAR_CURRENT_EXPORT_JOB:
      return {};
    default:
      return state;
  }
};

export default generateJobReducer;
