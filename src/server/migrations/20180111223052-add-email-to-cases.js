module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('cases', 'email', {
            type: Sequelize.STRING
        })

    },

    down: (queryInterface, Sequelize) => {
       return queryInterface.removeColumn('cases', 'email')
    }
};
