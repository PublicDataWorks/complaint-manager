import {
  runAllAuditMigrationHelpers,
  undoAllAuditMigrationHelpers
} from "../taskMigrationJobs/auditTransformationJobs/newAuditTasks";

module.exports = {
  up: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      try {
        await runAllAuditMigrationHelpers(transaction);
      } catch (error) {
        throw new Error(error);
      }
    });
  },
  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      try {
        await undoAllAuditMigrationHelpers(transaction);
      } catch (error) {
        throw new Error(error);
      }
    });
  }
};
