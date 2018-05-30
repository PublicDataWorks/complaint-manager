"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cases_officers", "first_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "middle_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "last_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "windows_username", {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn(
      "cases_officers",
      "supervisor_officer_number",
      {
        type: Sequelize.INTEGER
      }
    );
    await queryInterface.addColumn(
      "cases_officers",
      "supervisor_windows_username",
      {
        type: Sequelize.INTEGER
      }
    );
    await queryInterface.addColumn("cases_officers", "supervisor_first_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "supervisor_middle_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "supervisor_last_name", {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "employee_type", {
      type: Sequelize.ENUM(["Commissioned", "Non-Commissioned", "Recruit"]),
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "district", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "bureau", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "rank", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "dob", {
      type: Sequelize.DATEONLY
    });
    await queryInterface.addColumn("cases_officers", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("cases_officers", "sex", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "race", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "work_status", {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("cases_officers", "deleted_at", {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cases_officers", "first_name");
    await queryInterface.removeColumn("cases_officers", "middle_name");
    await queryInterface.removeColumn("cases_officers", "last_name");
    await queryInterface.removeColumn("cases_officers", "windows_username");
    await queryInterface.removeColumn(
      "cases_officers",
      "supervisor_windows_username"
    );
    await queryInterface.removeColumn(
      "cases_officers",
      "supervisor_officer_number"
    );
    await queryInterface.removeColumn(
      "cases_officers",
      "supervisor_first_name"
    );
    await queryInterface.removeColumn(
      "cases_officers",
      "supervisor_middle_name"
    );
    await queryInterface.removeColumn("cases_officers", "supervisor_last_name");
    await queryInterface.removeColumn("cases_officers", "employee_type");
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_cases_officers_employee_type";'
    );
    await queryInterface.removeColumn("cases_officers", "district");
    await queryInterface.removeColumn("cases_officers", "bureau");
    await queryInterface.removeColumn("cases_officers", "rank");
    await queryInterface.removeColumn("cases_officers", "dob");
    await queryInterface.removeColumn("cases_officers", "end_date");
    await queryInterface.removeColumn("cases_officers", "sex");
    await queryInterface.removeColumn("cases_officers", "race");
    await queryInterface.removeColumn("cases_officers", "work_status");
    await queryInterface.removeColumn("cases_officers", "deleted_at");
  }
};
