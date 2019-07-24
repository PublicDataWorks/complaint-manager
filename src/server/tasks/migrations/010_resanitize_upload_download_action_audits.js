import {
  rollbackSanitizeUploadDownloadAudits,
  sanitizeUploadDownloadAudits
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForUploadAndDownloadAudits";

module.exports = {
  up: async () => {
    await sanitizeUploadDownloadAudits();
  },
  down: async () => {
    await rollbackSanitizeUploadDownloadAudits();
  }
};
