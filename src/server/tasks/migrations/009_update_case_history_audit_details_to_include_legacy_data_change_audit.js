import {
  revertCaseHistoryAuditDetails,
  updateCaseHistoryAuditDetails
} from "../taskMigrationJobs/auditTransformationJobs/updateCaseHistoryAuditDetails";

module.exports = {
  up: async () => {
    await updateCaseHistoryAuditDetails();
  },
  down: async () => {
    await revertCaseHistoryAuditDetails();
  }
};
