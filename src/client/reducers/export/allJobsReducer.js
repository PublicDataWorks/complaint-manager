const allJobsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_EXPORT_JOBS_SUCCESS":
      return action.exportJobs;
    case "GET_EXPORT_JOB_SUCCESS":
      return { exportJob: action.exportJob };
    default:
      return state;
  }
};

export default allJobsReducer;
