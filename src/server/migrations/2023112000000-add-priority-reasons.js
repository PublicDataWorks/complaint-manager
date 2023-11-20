"use strict";

const PRIORITY_REASONS_TABLE = "priority_reasons";
const CREATE_PRIORITY_REASONS_QUERY = `CREATE TABLE IF NOT EXISTS ${PRIORITY_REASONS_TABLE} (
    id serial PRIMARY KEY,
    name VARCHAR ( 100 ) NOT NULL,
    created_at TIMESTAMPTZ
)`;

module.exports = {
    up: async (queryInterface, Sequelize) => {
    try {
        await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
            .query(CREATE_PRIORITY_REASONS_QUERY, { transaction })
        });
    } catch (error) {
        throw new Error(
        `Error while creating ${PRIORITY_REASONS_TABLE} table. Internal Error: ${error}`
        );
    }
    },

    down: async (queryInterface, Sequelize) => {
        try {
        await queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.sequelize
            .query(`DROP TABLE IF EXISTS ${PRIORITY_REASONS_TABLE}`, {
                transaction
            })
        });
        } catch (error) {
        throw new Error(
            `Error while removing ${PRIORITY_REASONS_TABLE} table. Internal Error: ${error}`
        );
        }
    }
    };
