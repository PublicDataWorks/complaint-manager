"use strict";

const winston = require("winston");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "cases_officers",
      "unique-case-officer-pair",
      {}
    );
    await queryInterface.addConstraint(
      "cases_officers",
      ["case_id", "officer_id", "deleted_at"],
      {
        type: "unique",
        name: "unique-case-officer-pair"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "cases_officers",
      "unique-case-officer-pair",
      {}
    );
    if (await constraintWillNotBeViolated(queryInterface)) {
      await queryInterface.addConstraint(
        "cases_officers",
        ["case_id", "officer_id"],
        {
          type: "unique",
          name: "unique-case-officer-pair"
        }
      );
    } else {
      winston.warn(
        "Duplicate officers exist for the same case. Uniqueness constraint is being skipped."
      );
    }
  }
};

async function constraintWillNotBeViolated(queryInterface) {
  const selectDuplicateCaseOfficersPerCase =
    "SELECT * FROM cases_officers \n" +
    "WHERE  (case_id, officer_id) IN (\n" +
    "    SELECT case_id, officer_id\n" +
    "    FROM   cases_officers\n" +
    "    GROUP  BY case_id, officer_id\n" +
    "    HAVING count(*) > 1 \n" +
    "    );";
  const resultIndex = 1;
  const resultsWithMetaData = (await queryInterface.sequelize.query(
    selectDuplicateCaseOfficersPerCase
  ))[resultIndex];
  return resultsWithMetaData.rowCount === 0;
}
