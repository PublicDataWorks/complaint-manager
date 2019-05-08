"use strict";
import models from "../models";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await models.action_audit.update(
        { subject: "Case Export" },
        {
          where: {
            action: "Exported",
            subject: "All Case Information"
          }
        }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await models.action_audit.update(
        { subject: "All Case Information" },
        {
          where: {
            action: "Exported",
            subject: "Case Export"
          }
        }
      );
    });
  }
};
