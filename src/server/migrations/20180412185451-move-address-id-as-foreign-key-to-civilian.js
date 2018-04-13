'use strict';
const models = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addColumn('civilians', 'address_id', {
                type: Sequelize.INTEGER,
                allowNull: true,
                references:{
                    model: 'addresses',
                    key: 'id'
                },
                transaction
            })

            let query = `SELECT id, civilian_id FROM addresses;`

            const addresses = await
                queryInterface.sequelize.query(query, {transaction})


            if (addresses[1].rowCount > 0) {
                addresses[0].map( async(address) => {
                    query = `UPDATE civilians SET address_id=${address.id} where civilians.id=${address.civilian_id};`
                    await queryInterface.sequelize.query(query, {transaction})
                })
            }

            await queryInterface.removeColumn('addresses', 'civilian_id', {
                transaction
            })

        })

    },

    down: async (queryInterface, Sequelize) => {

        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addColumn('addresses', 'civilian_id', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'civilians',
                    key: 'id'
                },
                transaction
            })

            let query = `SELECT id, address_id FROM civilians;`

            const civilians = await
                queryInterface.sequelize.query(query, {transaction})

            if (civilians[1].rowCount > 0) {
                civilians[0].map(async (civilian) => {
                    query = `UPDATE addresses SET civilian_id=${civilian.id} where addresses.id=${civilian.address_id};`
                    await queryInterface.sequelize.query(query, {transaction})
                })
            }

            await queryInterface.removeColumn('civilians', 'address_id', {
                transaction
            })
        })

    }
};
