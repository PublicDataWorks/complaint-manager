import renumberCaseReferenceNumbers from "../taskMigrationJobs/renumberCaseReferenceNumbers";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //can comment this task out after it runs in case models change in future
    await renumberCaseReferenceNumbers();
  },
  down: async () => {
    await renumberCaseReferenceNumbers(true);
  }
};
