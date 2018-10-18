import {
  BG_JOB_FAILED,
  EXPORT_JOB_COMPLETED,
  GENERATE_EXPORT_SUCCESS,
  EXPORT_JOB_STARTED,
  CLEAR_CURRENT_EXPORT_JOB,
  EXPORT_ALL_CASES_CONFIRMATION_OPENED,
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED
} from "../../sharedUtilities/constants";

export const exportJobCompleted = downloadUrl => ({
  type: EXPORT_JOB_COMPLETED,
  downloadUrl: downloadUrl
});

export const generateExportSuccess = jobId => ({
  type: GENERATE_EXPORT_SUCCESS,
  jobId
});

export const addBackgroundJobFailure = () => ({
  type: BG_JOB_FAILED
});

export const exportJobStarted = () => ({
  type: EXPORT_JOB_STARTED
});

export const openExportAuditLogConfirmationDialog = () => ({
  type: EXPORT_AUDIT_LOG_CONFIRMATION_OPENED
});

export const closeExportConfirmationDialog = () => ({
  type: EXPORT_CONFIRMATION_CLOSED
});

export const openExportAllCasesConfirmationDialog = () => ({
  type: EXPORT_ALL_CASES_CONFIRMATION_OPENED
});

export const clearCurrentExportJob = () => ({
  type: CLEAR_CURRENT_EXPORT_JOB
});
