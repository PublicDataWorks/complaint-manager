import {
  BG_JOB_FAILED,
  GET_EXPORT_JOB_SUCCESS,
  GENERATE_EXPORT_SUCCESS
} from "../../sharedUtilities/constants";

export const getExportJobSuccess = data => ({
  type: GET_EXPORT_JOB_SUCCESS,
  exportJob: data
});

export const generateExportSuccess = jobId => ({
  type: GENERATE_EXPORT_SUCCESS,
  jobId
});

export const addBackgroundJobFailure = () => ({
  type: BG_JOB_FAILED
});
