"use strict";

const features = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/features.json`);

const INSERT_FEATURES = `INSERT INTO feature_toggles (name, description, enabled, is_dev)
    VALUES `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = features.reduce((acc, elem) => {
      return `${acc} ('${elem.name}', '${elem.description}', ${
        process.env.NODE_ENV !== "production" &&
        (elem.name === "nonUserAuthenticationFeature" ||
          elem.name === "styleGuideFeature")
          ? "TRUE"
          : !!elem.enabled
      }, FALSE),`;
    }, INSERT_FEATURES);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(query, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding table data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query("TRUNCATE feature_toggles CASCADE", {
        transaction
      });
    });
  }
};
