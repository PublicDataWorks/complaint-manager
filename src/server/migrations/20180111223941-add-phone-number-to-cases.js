module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('cases', 'phone_number', Sequelize.DECIMAL(10,0))
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('cases', 'phone_number')
    }
};

