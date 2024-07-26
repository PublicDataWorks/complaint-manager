"use strict";
const TABLE = `race_ethnicities`
const ADD_RACE_QUERY = `INSERT INTO ${TABLE} ("name", "createdAt", "updatedAt")
values ('Prefer Not to Answer', NOW(),NOW()),
	   ('N/A', NOW(),NOW());`

module.exports = {
    up: async (queryInterface, Sequelize) => {
        if (process.env.ORG === "NOIPM") {
        try {
            await queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.sequelize.query(ADD_RACE_QUERY, {
                transaction
            });
        });
        } catch (error) {
            throw new Error(
            `Error while seeding new data from ${TABLE}. Internal Error: ${error}`
            );
        }
        }
},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
            `
    DELETE ${TABLE}
    WHERE "name" IN ('Prefer Not to Answer', 'N/A');
    `,
            {
            transaction
            }
        );
        });
    }
};
