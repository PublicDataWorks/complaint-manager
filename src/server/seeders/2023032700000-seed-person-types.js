"use strict";
const {
  DEFAULT_PERSON_TYPE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
const TABLE = "person_types";

const INSERT_PERSON_TYPES = `INSERT INTO ${TABLE}(key, description, employee_description, abbreviation, legend, dialog_action, is_default, sub_types) 
  VALUES `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = Object.keys(PERSON_TYPE).reduce((acc, key) => {
      const elem = PERSON_TYPE[key];
      return `${acc} ('${key}', '${elem.description}', ${
        elem.isEmployee ? `'${elem.employeeDescription}'` : "NULL"
      }, '${elem.abbreviation}', '${elem.complainantLegendValue}', '${
        elem.createDialogAction
      }', ${elem === DEFAULT_PERSON_TYPE}, ${
        elem.subTypes
          ? `'{${elem.subTypes.reduce(
              (acc, subType) => `${acc === "" ? "" : `${acc}, `}"${subType}"`,
              ""
            )}}'`
          : "NULL"
      }),`;
    }, INSERT_PERSON_TYPES);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(query, {
          transaction
        });

        if (process.env.ORG === "NOIPM") {
          await queryInterface.sequelize.query(
            `UPDATE civilians SET person_type = 'CIVILIAN' WHERE person_type IS NULL`,
            { transaction }
          );
        } else if (PERSON_TYPE.PERSON_IN_CUSTODY) {
          await queryInterface.sequelize.query(
            `UPDATE cases_inmates SET person_type_key = 'PERSON_IN_CUSTODY' WHERE person_type_key IS NULL`,
            { transaction }
          );
        }
      });
    } catch (error) {
      throw new Error(
        `Error while seeding person_types data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        `UPDATE civilians SET person_type = NULL WHERE person_type IS NOT NULL`
      );
      await queryInterface.sequelize.query(
        `UPDATE cases_inmates SET person_type_key = NULL WHERE person_type_key IS NOT NULL`
      );
      await queryInterface.sequelize.query(
        `UPDATE cases_officers SET person_type = NULL WHERE person_type IS NOT NULL`
      );
      await queryInterface.sequelize.query(`DELETE FROM ${TABLE} WHERE TRUE`, {
        transaction
      });
    });
  }
};
