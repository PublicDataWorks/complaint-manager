"use strict";
const FACILITIES = [
  {
    abbreviation: "PSD Administration",
    name: "Department of Public Safety Administration"
  },
  {
    abbreviation: "OOS-CA",
    name: "Out of State - California"
  },
  {
    abbreviation: "OOS-CO",
    name: "Out of State - Colorado"
  },
  {
    abbreviation: "OOS-FL",
    name: "Out of State - Florida"
  },
  {
    abbreviation: "OOS-IN",
    name: "Out of State - Indiana"
  },
  {
    abbreviation: "OOS-NM",
    name: "Out of State - New Mexico"
  },
  {
    abbreviation: "OOS-NV",
    name: "Out of State - Nevada"
  },
  {
    abbreviation: "OOS-UT",
    name: "Out of State - Utah"
  },
  {
    abbreviation: "OOS-VA",
    name: "Out of State - Virginia"
  },
  {
    abbreviation: "OOS-ZFEDS",
    name: "Out of State - Federal"
  },
  {
    abbreviation: "OOS-ZOTHER",
    name: "Out of State - Other"
  }
];

const TABLE = "facilities";

const INSERT_FACILITIES = `INSERT INTO ${TABLE}(abbreviation, name) 
  VALUES `;

const INMATE_FACILITY_QUERY = `UPDATE inmates
  SET facility_id =<id>
  WHERE facility = '<abbreviation>'
`;

const NEW_FACILITIES_QUERY = `WHERE name IN ('Department of Public Safety Administration',
 'Out of State - California',
 'Out of State - Colorado',
 'Out of State - Florida',
 'Out of State - Indiana',
 'Out of State - New Mexico',
 'Out of State - Nevada',
 'Out of State - Utah',
 'Out of State - Virginia',
 'Out of State - Federal',
 'Out of State - Other')`;

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
        `UPDATE inmates SET facility_id = NULL WHERE facility_id IN 
		(SELECT id FROM ${TABLE} ${NEW_FACILITIES_QUERY})`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE cases SET facility_id = NULL WHERE facility_id IN 
		(SELECT id FROM ${TABLE} ${NEW_FACILITIES_QUERY})`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DELETE FROM ${TABLE} ${NEW_FACILITIES_QUERY}`,
        {
          transaction
        }
      );
    });
  }
};
