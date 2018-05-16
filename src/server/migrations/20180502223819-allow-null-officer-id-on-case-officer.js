"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE cases_officers ALTER COLUMN officer_id DROP NOT NULL;`
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER TABLE cases_officers ALTER COLUMN officer_id SET NOT NULL;`
    );
  }
};
