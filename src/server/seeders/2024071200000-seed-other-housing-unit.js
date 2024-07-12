const INSERT_QUERY = `INSERT INTO housing_units (name, facility_id) VALUES`;
const VALUE_TEMPLATE = `('{name}', {facility_id})`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.ORG === "HAWAII") {
      try {
        await queryInterface.sequelize.transaction(async transaction => {
          let query = INSERT_QUERY;
          const result = await queryInterface.sequelize.query(
            "SELECT id FROM facilities WHERE abbreviation = 'HCF'",
            { transaction }
          );

          query += VALUE_TEMPLATE.replace("{name}", "Other").replace(
            "{facility_id}",
            result[0][0].id
          );
          await queryInterface.sequelize.query(query, {
            transaction
          });
        });
      } catch (error) {
        throw new Error(
          `Error while seeding other housing_unit. Internal Error: ${error}`
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        const result = await queryInterface.sequelize.query(
          "SELECT id from housing_units WHERE name = 'Other'",
          { transaction }
        );
        const id = result[0][0]?.id;
        if (id) {
          await queryInterface.sequelize.query(
            `UPDATE cases SET housing_unit_id = NULL WHERE housing_unit_id = ${id}`,
            { transaction }
          );
          await queryInterface.sequelize.query(
            `DELETE FROM housing_units WHERE id = ${id}`,
            { transaction }
          );
        }
      });
    } catch (error) {
      throw new Error(
        `Error while removing other housing_unit. Internal Error: ${error}`
      );
    }
  }
};
