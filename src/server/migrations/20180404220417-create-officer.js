"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("officers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      officerNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      rank: {
        type: Sequelize.STRING
      },
      race: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      bureau: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      workStatus: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("officers");
  }
};
