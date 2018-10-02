const allJobsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_EXPORT_JOBS_SUCCESS":
      return action.exportJobs;
    default:
      return state;
  }
};

export default allJobsReducer;
