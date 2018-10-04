"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("referral_letter_officer_history_notes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      referral_letter_officer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "referral_letter_officers",
          key: "id"
        }
      },
      pib_case_number: {
        type: Sequelize.STRING
      },
      details: {
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
    return queryInterface.dropTable("referral_letter_officer_history_notes");
  }
};
