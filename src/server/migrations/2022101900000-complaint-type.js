"use strict";

const {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} = require("../../sharedUtilities/constants");

const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const COMPLAINT_TYPE_TABLE = "complaint_types";
const COMPLAINT_TYPE_COLUMN = "complaint_type";
const CREATE_COMPLAINT_TYPES_QUERY = `CREATE TABLE IF NOT EXISTS ${COMPLAINT_TYPE_TABLE} (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

const INSERT_COMPLAINT_TYPES = `INSERT INTO ${COMPLAINT_TYPE_TABLE}(name) 
  VALUES 
    ('${CIVILIAN_INITIATED}'),
    ('${RANK_INITIATED}'),
    ('${CIVILIAN_WITHIN_PD_INITIATED}')
`;
const CASES_TABLE = "cases";

const UPDATE_CASES = `ALTER TABLE ${CASES_TABLE}
ADD CONSTRAINT cases_${COMPLAINT_TYPE_TABLE}_fk FOREIGN KEY (${COMPLAINT_TYPE_COLUMN}) references ${COMPLAINT_TYPE_TABLE} (name)`;

const REVERT_CASES = `ALTER TABLE ${CASES_TABLE}
DROP CONSTRAINT cases_${COMPLAINT_TYPE_TABLE}_fk`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_COMPLAINT_TYPES_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(INSERT_COMPLAINT_TYPES, {
          transaction
        });
        await queryInterface.sequelize.query(UPDATE_CASES, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${COMPLAINT_TYPE_TABLE} table and updating ${CASES_TABLE}. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_CASES, { transaction });
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS ${COMPLAINT_TYPE_TABLE}`,
          {
            transaction
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${COMPLAINT_TYPE_TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
