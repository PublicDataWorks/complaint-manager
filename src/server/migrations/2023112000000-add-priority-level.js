"use strict";

const PRIORITY_LEVELS_TABLE = "priority_levels";
const CREATE_PRIORITY_LEVELS_QUERY = `CREATE TABLE IF NOT EXISTS ${PRIORITY_LEVELS_TABLE} (
    id serial PRIMARY KEY,
    name VARCHAR ( 100 ) NOT NULL,
    created_at TIMESTAMPTZ
)`;

module.exports = {
    up: async (queryInterface, Sequelize) => {
    try {
        await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
            .query(CREATE_PRIORITY_LEVELS_QUERY, { transaction })
        });
    } catch (error) {
        throw new Error(
        `Error while creating ${PRIORITY_LEVELS_TABLE} table. Internal Error: ${error}`
        );
    }
    },

    down: async (queryInterface, Sequelize) => {
        try {
        await queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.sequelize
            .query(`DROP TABLE IF EXISTS ${PRIORITY_LEVELS_TABLE}`, {
                transaction
            })
        });
        } catch (error) {
        throw new Error(
            `Error while removing ${PRIORITY_LEVELS_TABLE} table. Internal Error: ${error}`
        );
        }
    }
    };
