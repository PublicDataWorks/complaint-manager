"use strict";

import { ADDRESSABLE_TYPE } from "../../sharedUtilities/constants";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("addresses", "addressable_type", {
      type: Sequelize.ENUM([ADDRESSABLE_TYPE.CASES, ADDRESSABLE_TYPE.CIVILIAN])
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.changeColumn("addresses", "addressable_type", {
        type: Sequelize.STRING
      });

      const query = 'DROP TYPE "enum_addresses_addressable_type";';
      await queryInterface.sequelize.query(query, { transaction });
    });
  }
};
