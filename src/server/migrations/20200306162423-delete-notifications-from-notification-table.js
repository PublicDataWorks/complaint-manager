"use strict";

import models from "../policeDataManager/models";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      try {
        await models.notification.destroy({
          where: {},
          force: true,
          transaction: transaction,
          auditUser: "someone"
        });
      } catch (error) {
        throw new Error(
          `Error while deleting notifications from table. \n Intenal Error: ${error}`
        );
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
        Since we are reverting a bad state of data, we do not need a down migration.
      */
  }
};
