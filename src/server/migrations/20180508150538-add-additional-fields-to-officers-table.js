'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('officers', 'supervisor', {
      type: Sequelize.INTEGER,
    })
      await queryInterface.addColumn('officers', 'hire_date', {
        type: Sequelize.DATE,
      })
      await queryInterface.addColumn('officers', 'end_date', {
          type: Sequelize.DATE,
      })
      await queryInterface.addColumn('officers', 'employee_type', {
        type: Sequelize.ENUM(['Commissioned', 'Non-Commissioned', 'Recruit']),
          allowNull: true
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('officers', 'supervisor')
      await queryInterface.removeColumn('officers', 'hire_date')
      await queryInterface.removeColumn('officers', 'end_date')
      await queryInterface.removeColumn('officers', 'employee_type')
      await queryInterface.sequelize.query('DROP TYPE "enum_officers_employee_type";');
  }
};
