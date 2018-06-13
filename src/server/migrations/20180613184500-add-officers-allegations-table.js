"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("officers_allegations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      details: {
        allowNull: false,
        type: Sequelize.STRING
      },
      case_officer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "cases_officers",
          key: "id"
        }
      },
      allegation_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "allegations",
          key: "id"
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("officers_allegations");
  }
};
