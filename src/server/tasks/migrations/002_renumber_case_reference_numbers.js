import renumberCaseReferenceNumbers from "../taskMigrationJobs/renumberCaseReferenceNumbers";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //can comment this task out after it runs in case models change in future
    /*
    - Task ran in production for the first time on 1/22/2019 in v2.4.0
    - Task ran for a second time on 1/29/2019 before commented out in v2.6.0
     */
    // await renumberCaseReferenceNumbers();
  },
  down: async () => {
    // await renumberCaseReferenceNumbers(true);
  }
};
