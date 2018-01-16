module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cases', 'incident_type', {
        allowNull: false,
        type: Sequelize.ENUM(
            'Citizen Complaint','Officer Complaint','Criminal Liaison Case','Commendation'
        ),
        defaultValue: 'Citizen Complaint'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('cases', 'incident_type');
  }
};
