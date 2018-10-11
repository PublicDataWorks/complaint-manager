const generateJobReducer = (state = [], action) => {
  switch (action.type) {
    case "GENERATE_EXPORT_SUCCESS":
      return action.jobId;
    default:
      return state;
  }
};

export default generateJobReducer;
