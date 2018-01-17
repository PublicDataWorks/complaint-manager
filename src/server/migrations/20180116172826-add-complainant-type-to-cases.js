module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cases', 'complainant_type', {
        allowNull: false,
        type: Sequelize.ENUM(
            'Civilian', 'Police Officer'
        ),
        defaultValue: 'Civilian'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cases', 'complainant_type');
  }
};
