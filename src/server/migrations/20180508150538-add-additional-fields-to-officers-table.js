"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("officers", ["officer_number"], {
      type: "unique",
      name: "uniqueOfficerNumber"
    });

    await queryInterface.addColumn("officers", "supervisor_officer_number", {
      type: Sequelize.INTEGER,
      references: {
        model: "officers",
        key: "officer_number"
      }
    });
    await queryInterface.addColumn("officers", "hire_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("officers", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.addColumn("officers", "employee_type", {
      type: Sequelize.ENUM(["Commissioned", "Non-Commissioned", "Recruit"]),
      allowNull: true
    });
    await queryInterface.addColumn("officers", "windows_username", {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("officers", "supervisor_officer_number");
    await queryInterface.removeColumn("officers", "hire_date");
    await queryInterface.removeColumn("officers", "end_date");
    await queryInterface.removeColumn("officers", "employee_type");
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_officers_employee_type";'
    );
    await queryInterface.removeColumn("officers", "windows_username");
    await queryInterface.removeConstraint("officers", "uniqueOfficerNumber");
  }
};
