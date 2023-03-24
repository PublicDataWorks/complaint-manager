"use strict";

const {
  FACILITIES
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
const UPDATE_QUERY = `UPDATE facilities SET address = '{address}' WHERE abbreviation = '{abbreviation}'`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        if (FACILITIES) {
          await Promise.all(
            FACILITIES.map(async facility => {
              await queryInterface.sequelize.query(
                UPDATE_QUERY.replaceAll(
                  "{address}",
                  facility.address
                ).replaceAll("{abbreviation}", facility.abbreviation),
                {
                  transaction
                }
              );
            })
          );
        }
      });
    } catch (error) {
      throw new Error(`Error while adding facility addresses ${error}`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          "UPDATE facilities SET address = NULL",
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while reverting facility addresses. Internal Error: ${error}`
      );
    }
  }
};
