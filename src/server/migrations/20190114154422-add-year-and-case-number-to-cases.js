"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await addYearAndCaseNumberColumns(queryInterface, Sequelize, transaction);
      await populateNewColumns(queryInterface, Sequelize, transaction);
      await addNotNullConstraints(queryInterface, Sequelize, transaction);
      await addUniqueConstraint(queryInterface, Sequelize, transaction);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("cases", "year", { transaction });
      await queryInterface.removeColumn("cases", "case_number", {
        transaction
      });
    });
  }
};

const addYearAndCaseNumberColumns = async (
  queryInterface,
  Sequelize,
  transaction
) => {
  await queryInterface.addColumn(
    "cases",
    "year",
    {
      type: Sequelize.INTEGER
    },
    { transaction }
  );
  await queryInterface.addColumn(
    "cases",
    "case_number",
    {
      type: Sequelize.INTEGER
    },
    { transaction }
  );
};

const populateNewColumns = async (queryInterface, Sequelize, transaction) => {
  const query = `UPDATE cases set year = date_part('year', "first_contact_date"), case_number = id`;
  await queryInterface.sequelize
    .query(query, { transaction })
    .spread((results, metadata) => {
      console.info(
        `Number of cases populated with year and case number: ${
          metadata.rowCount
        }`
      );
    });
};

const addNotNullConstraints = async (
  queryInterface,
  Sequelize,
  transaction
) => {
  await queryInterface.changeColumn(
    "cases",
    "year",
    {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    { transaction }
  );
  await queryInterface.changeColumn(
    "cases",
    "case_number",
    {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    { transaction }
  );
};

const addUniqueConstraint = async (queryInterface, Sequelize, transaction) => {
  queryInterface.addConstraint(
    "cases",
    ["year", "case_number"],
    { type: "unique", name: "cases_unique_reference_number" },
    { transaction }
  );
};
