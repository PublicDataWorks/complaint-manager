import {
  provideAuditDetailsForDataAccessOfCaseWithAllAssociations,
  setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessOfCaseWithAllAssociations";

module.exports = {
  up: async () => {
    await provideAuditDetailsForDataAccessOfCaseWithAllAssociations();
  },
  down: async () => {
    await setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations();
  }
};
