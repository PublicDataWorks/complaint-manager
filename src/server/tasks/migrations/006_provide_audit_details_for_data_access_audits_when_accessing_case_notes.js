import {
  provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes,
  setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes";

module.exports = {
  up: async () => {
    await provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes();
  },
  down: async () => {
    await setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes();
  }
};
