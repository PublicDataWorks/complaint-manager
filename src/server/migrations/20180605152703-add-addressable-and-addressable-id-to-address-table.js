"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "addresses",
        "addressable_type",
        {
          type: Sequelize.STRING
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "addresses",
        "addressable_id",
        {
          type: Sequelize.INTEGER
        },
        { transaction }
      );

      let query =
        "SELECT id, incident_location_id FROM cases " +
        "WHERE incident_location_id IS NOT NULL;";
      const incidentLocations = await queryInterface.sequelize.query(query, {
        transaction
      });

      if (incidentLocations[1].rowCount > 0) {
        incidentLocations[0].forEach(async incidentLocation => {
          query = `UPDATE addresses SET addressable_type='cases', addressable_id=${
            incidentLocation.id
          } WHERE id=${incidentLocation.incident_location_id};`;
          await queryInterface.sequelize.query(query, { transaction });
        });
      }

      query = `SELECT id, address_id FROM civilians WHERE address_id IS NOT NULL;`;
      const civilianAddresses = await queryInterface.sequelize.query(query, {
        transaction
      });

      if (civilianAddresses[1].rowCount > 0) {
        civilianAddresses[0].forEach(async civilianAddress => {
          query = `UPDATE addresses SET addressable_type='civilian', addressable_id=${
            civilianAddress.id
          } WHERE id=${civilianAddress.address_id};`;
          await queryInterface.sequelize.query(query, { transaction });
        });
      }

      await queryInterface.removeColumn("cases", "incident_location_id", {
        transaction
      });
      await queryInterface.removeColumn("civilians", "address_id", {
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        "civilians",
        "address_id",
        {
          type: Sequelize.INTEGER,
          references: {
            model: "addresses",
            key: "id"
          }
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "cases",
        "incident_location_id",
        {
          type: Sequelize.INTEGER,
          references: {
            model: "addresses",
            key: "id"
          }
        },
        { transaction }
      );

      let query = `SELECT id, addressable_id FROM addresses WHERE addressable_type='cases';`;
      const incidentLocations = await queryInterface.sequelize.query(query, {
        transaction
      });

      if (incidentLocations[1].rowCount > 0) {
        incidentLocations[0].forEach(async incidentLocation => {
          query = `UPDATE cases SET incident_location_id=${
            incidentLocation.id
          } WHERE id=${incidentLocation.addressable_id};`;
          await queryInterface.sequelize.query(query, { transaction });
        });
      }

      query = `SELECT id, addressable_id FROM addresses WHERE addressable_type='civilian';`;
      const civilianAddresses = await queryInterface.sequelize.query(query, {
        transaction
      });

      if (civilianAddresses[1].rowCount > 0) {
        civilianAddresses[0].forEach(async civilianAddress => {
          query = `UPDATE civilians SET address_id=${
            civilianAddress.id
          } WHERE id=${civilianAddress.addressable_id};`;
          await queryInterface.sequelize.query(query, { transaction });
        });
      }

      await queryInterface.removeColumn("addresses", "addressable_type", {
        transaction
      });
      await queryInterface.removeColumn("addresses", "addressable_id", {
        transaction
      });
    });
  }
};
