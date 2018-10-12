import { CLEAR_CURRENT_EXPORT_JOB } from "../../../sharedUtilities/constants";

const allJobsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_EXPORT_JOBS_SUCCESS":
      return action.exportJobs;
    case "GET_EXPORT_JOB_SUCCESS":
      return { exportJob: action.exportJob };
    case CLEAR_CURRENT_EXPORT_JOB:
      return { exportJob: { result: { downloadUrl: "" } } };
    default:
      return state;
  }
};

export default allJobsReducer;
