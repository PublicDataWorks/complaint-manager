export const getExportJobsSuccess = data => ({
  type: "GET_EXPORT_JOBS_SUCCESS",
  exportJobs: data
});

export const getExportJobSuccess = data => ({
  type: "GET_EXPORT_JOB_SUCCESS",
  exportJob: data
});

export const generateExportSuccess = jobId => ({
  type: "GENERATE_EXPORT_SUCCESS",
  jobId
});
