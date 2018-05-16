"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("data_change_audits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      case_id: {
        type: Sequelize.INTEGER
      },
      model_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      model_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      snapshot: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING
      },
      changes: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("data_change_audits");
  }
};
