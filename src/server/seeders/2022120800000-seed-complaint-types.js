"use strict";

const {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} = require("../../sharedUtilities/constants");

const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const COMPLAINT_TYPE_TABLE = "complaint_types";

const hawaiiComplaintTypes = [
  "Medical",
  "Mental Health",
  "Staff Misconduct",
  "PREA",
  "Mail",
  "Food",
  "Property",
  "Visitation",
  "Programming",
  "Reentry",
  "Parole",
  "Probation",
  "Security Classification",
  "Facility-Wide",
  "Department-Wide",
  "Access to Courts/Missed Evals",
  "ADA",
  "Library",
  "Living Conditions",
  "Misconduct/facility adjudication process",
  "Case Management",
  "Education",
  "Religious services",
];

const COMPLAINT_TYPES =
  process.env.ORG === "NOIPM"
    ? [CIVILIAN_INITIATED, RANK_INITIATED, CIVILIAN_WITHIN_PD_INITIATED]
    : hawaiiComplaintTypes.sort();

const INSERT_COMPLAINT_TYPES = `INSERT INTO ${COMPLAINT_TYPE_TABLE}(name)
  VALUES `;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = COMPLAINT_TYPES.reduce((acc, elem) => {
      return `${acc} ('${elem}'),`;
    }, INSERT_COMPLAINT_TYPES);
    query = query.slice(0, -1);
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(query, {
          transaction
        });

        const complaintTypes = await queryInterface.sequelize.query(
          `SELECT id, name FROM ${COMPLAINT_TYPE_TABLE}`,
          {
            transaction
          }
        );
        await Promise.all(
          complaintTypes[0].map(async type => {
            await queryInterface.sequelize.query(
              `UPDATE cases SET complaint_type_id = ${type.id} WHERE complaint_type = '${type.name}'`,
              {
                transaction
              }
            );
          })
        );
      });
    } catch (error) {
      throw new Error(
        `Error while seeding complaint type data. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        "TRUNCATE letter_type_complaint_type",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "UPDATE cases SET complaint_type_id = NULL WHERE complaint_type_id IS NOT NULL",
        { transaction }
      );
      await queryInterface.sequelize.query(
        "DELETE FROM complaint_types WHERE TRUE",
        {
          transaction
        }
      );
    });
  }
};
