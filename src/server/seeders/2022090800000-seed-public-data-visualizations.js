"use strict";

const {
  DATA_SECTIONS,
  QUERY_TYPES
} = require("../../sharedUtilities/constants");

const INSERT_VISUALIZATIONS = `INSERT INTO public_data_visualizations (query_type, title, subtitle, collapsed_text, full_message, order_key) 
  VALUES 
    ${Object.values(DATA_SECTIONS).reduce(
      (acc, section) =>
        `${acc ? `${acc}, ` : ""}
        ('${Object.keys(QUERY_TYPES).find(
          key => QUERY_TYPES[key] === section.queryType
        )}', 
        '${section.title}', '${section.subtitle}', 
        '${section.collapsedText}', '${section.fullMessage}',
        '${section.orderKey}')`,
      ""
    )}
  `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(INSERT_VISUALIZATIONS, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding visualization data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        "TRUNCATE public_data_visualizations CASCADE",
        {
          transaction
        }
      );
    });
  }
};
