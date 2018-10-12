import {
  EXPORT_AUDIT_LOG_CONFIRMATION_OPENED,
  EXPORT_CONFIRMATION_CLOSED,
  EXPORT_ALL_CASES_CONFIRMATION_OPENED,
  CLEAR_CURRENT_EXPORT_JOB
} from "../../sharedUtilities/constants";

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
