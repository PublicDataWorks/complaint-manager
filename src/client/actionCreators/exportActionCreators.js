import {
  CLEAR_CURRENT_EXPORT_JOB,
  EXPORT_CASES_CONFIRMATION_OPENED,
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED,
  EXPORT_JOB_COMPLETED,
  EXPORT_JOB_STARTED,
  GENERATE_EXPORT_SUCCESS
} from "../../sharedUtilities/constants";

export const exportJobCompleted = downloadUrl => ({
  type: EXPORT_JOB_COMPLETED,
  downloadUrl: downloadUrl
});

export const generateExportSuccess = jobId => ({
  type: GENERATE_EXPORT_SUCCESS,
  jobId
});

export const exportJobStarted = () => ({
  type: EXPORT_JOB_STARTED
});

export const openExportAuditLogConfirmationDialog = (dateRange = null) => {
  return {
    type: EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
    dateRange
  };
};

export const closeExportConfirmationDialog = () => ({
  type: EXPORT_CONFIRMATION_CLOSED
});

export const openExportCasesConfirmationDialog = (dateRange = null) => {
  return {
    type: EXPORT_CASES_CONFIRMATION_OPENED,
    dateRange
  };
};

export const clearCurrentExportJob = () => ({
  type: CLEAR_CURRENT_EXPORT_JOB
});
