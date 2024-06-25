import loadCsvIntoAnArray from "../seeder_jobs/loadCsvIntoAnArray";

const INSERT_QUERY = `INSERT INTO housing_units (name, facility_id) VALUES`;
const VALUE_TEMPLATE = `('{name}', {facility_id})`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "HAWAII") {
      try {
        await queryInterface.sequelize.transaction(async transaction => {
          let query = INSERT_QUERY;
          const housingUnits = await loadCsvIntoAnArray("housingUnits.csv");
          let facilities_id = {};

          const result = await queryInterface.sequelize.query(
            "SELECT id, abbreviation FROM facilities",
            { transaction }
          );
          for (const row of result[0]) {
            let { abbreviation, id } = row;
            facilities_id[abbreviation] = id;
          }

          for (const row of housingUnits) {
            const { name, facility_abbreviation } = row;
            query +=
              VALUE_TEMPLATE.replace("{name}", name).replace(
                "{facility_id}",
                facilities_id[facility_abbreviation]
              ) + ", ";
          }
          query = query.slice(0, -2);
          await queryInterface.sequelize.query(query, {
            transaction
          });
        });
      } catch (error) {
        throw new Error(
          `Error while seeding housing_units data. Internal Error: ${error}`
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          "TRUNCATE TABLE housing_units CASCADE"
        );
      });
    } catch (error) {
      throw new Error(
        `Error while truncating housing_units data. Internal Error: ${error}`
      );
    }
  }
};
