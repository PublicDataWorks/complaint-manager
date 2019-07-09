import {
  runAllAuditMigrationHelpers,
  undoAllAuditMigrationHelpers
} from "../taskMigrationJobs/auditTransformationJobs/newAuditTasks";

module.exports = {
  up: async () => {
    await runAllAuditMigrationHelpers();
  },
  down: async () => {
    await undoAllAuditMigrationHelpers();
  }
};
