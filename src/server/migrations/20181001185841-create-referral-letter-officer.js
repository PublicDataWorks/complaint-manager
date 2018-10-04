"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("referral_letter_officers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      case_officer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cases_officers",
          key: "id"
        }
      },
      referral_letter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "referral_letters",
          key: "id"
        }
      },
      number_historical_high_allegations: {
        type: Sequelize.INTEGER
      },
      number_historical_medium_allegations: {
        type: Sequelize.INTEGER
      },
      number_historical_low_allegations: {
        type: Sequelize.INTEGER
      },
      historical_behavior_notes: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable("referral_letter_officers");
  }
};
