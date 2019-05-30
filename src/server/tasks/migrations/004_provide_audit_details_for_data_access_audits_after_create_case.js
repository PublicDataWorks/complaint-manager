import {
  provideAuditDetailsForDataAccessAuditsAfterCreateCase,
  setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsAfterCreateCase";

module.exports = {
  up: async () => {
    await provideAuditDetailsForDataAccessAuditsAfterCreateCase();
  },
  down: async () => {
    await setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase();
  }
};
