module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('cases', 'status', {
            allowNull: false,
            type: Sequelize.ENUM(
                'Initial', 'Active', 'Forwarded', 'Suspended', 'Complete'
            ),
            defaultValue: 'Initial'
        })

        await queryInterface.renameColumn('cases', 'firstName', 'first_name')
        await queryInterface.renameColumn('cases', 'lastName', 'last_name')
        await queryInterface.renameColumn('cases', 'createdAt', 'created_at')
        await queryInterface.renameColumn('cases', 'updatedAt', 'updated_at')

        await queryInterface.changeColumn('cases', 'first_name', {
            type: Sequelize.STRING(25)
        })
        await queryInterface.changeColumn('cases', 'last_name', {
            type: Sequelize.STRING(25)
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('cases', 'status')

        await queryInterface.renameColumn('cases', 'first_name', 'firstName')
        await queryInterface.renameColumn('cases', 'last_name', 'lastName')
        await queryInterface.renameColumn('cases', 'created_at', 'createdAt')
        await queryInterface.renameColumn('cases', 'updated_at', 'updatedAt')

        await queryInterface.changeColumn('cases', 'firstName', {
            type: Sequelize.STRING
        })
        await queryInterface.changeColumn('cases', 'lastName', {
            type: Sequelize.STRING
        })
    }
}
