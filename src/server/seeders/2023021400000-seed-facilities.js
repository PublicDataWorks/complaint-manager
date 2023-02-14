"use strict";
const {
  FACILITIES
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
const TABLE = "facilities";

const INSERT_FACILITIES = `INSERT INTO ${TABLE}(abbreviation, name) 
  VALUES `;

const INMATE_FACILITY_QUERY = `UPDATE inmates
  SET facility_id =<id>
  WHERE facility = '<abbreviation>'
`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (FACILITIES) {
      let query = FACILITIES.reduce((acc, elem) => {
        return `${acc} ('${elem.abbreviation}', '${elem.name.replaceAll(
          "'",
          "''" // escaping single quotes (apostrophes) in facility names
        )}'),`;
      }, INSERT_FACILITIES);
      query = query.slice(0, -1); // lop off the trailing comma
      try {
        await queryInterface.sequelize.transaction(async transaction => {
          await queryInterface.sequelize.query(query, {
            transaction
          });
          const result = await queryInterface.sequelize.query(
            `SELECT * FROM ${TABLE}`,
            { transaction }
          );

          await Promise.all(
            result[0].map(async facility => {
              await queryInterface.sequelize.query(
                INMATE_FACILITY_QUERY.replace("<id>", facility.id).replace(
                  "<abbreviation>",
                  facility.abbreviation
                ),
                {
                  transaction
                }
              );
            })
          );
        });
      } catch (error) {
        throw new Error(
          `Error while seeding ${TABLE} data. Internal Error: ${error}`
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        "UPDATE inmates SET facility_id = NULL WHERE facility_id IS NOT NULL",
        { transaction }
      );
      await queryInterface.sequelize.query(`DELETE FROM ${TABLE} WHERE TRUE`, {
        transaction
      });
    });
  }
};
