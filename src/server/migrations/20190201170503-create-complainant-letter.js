"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("complainant_letters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      caseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "case_id",
        references: {
          model: "cases",
          key: "id"
        }
      },
      finalPdfFilename: {
        type: Sequelize.STRING,
        field: "final_pdf_filename"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at"
      },
      complainantCivilianId: {
        type: Sequelize.INTEGER,
        field: "complainant_civilian_id",
        references: {
          model: "civilians",
          key: "id"
        }
      },
      complainantOfficerId: {
        type: Sequelize.INTEGER,
        field: "complainant_officer_id",
        references: {
          model: "cases_officers",
          key: "id"
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("complainant_letters");
  }
};
