"use strict";

const TABLE = "inmates";
const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  inmate_id VARCHAR ( 10 ) PRIMARY KEY,
  first_name VARCHAR ( 30 ) NOT NULL,
  last_name VARCHAR ( 30 ) NOT NULL,
  region VARCHAR ( 20 ),
  facility VARCHAR ( 50 ),
  location_sub_1 VARCHAR ( 50 ),
  location_sub_2 VARCHAR ( 50 ),
  location_sub_3 VARCHAR ( 50 ),
  location_sub_4 VARCHAR ( 50 ),
  housing VARCHAR ( 50 ),
  current_location VARCHAR ( 50 ),
  status VARCHAR ( 50 ),
  custody_status VARCHAR ( 50 ),
  custody_status_reason TEXT,
  security_classification VARCHAR ( 20 ),
  gender VARCHAR ( 10 ),
  primary_ethnicity VARCHAR ( 100 ),
  race VARCHAR ( 30 ),
  muster VARCHAR ( 50 ),
  indigent BOOLEAN,
  release_type VARCHAR ( 100 ),
  classification_date DATE,
  booking_start_date DATE,
  tentative_release_date DATE,
  booking_end_date DATE,
  actual_release_date DATE,
  weekender BOOLEAN,
  date_of_birth DATE,
  age INTEGER,
  country_of_birth VARCHAR ( 100 ),
  citizenship VARCHAR ( 100 ),
  religion VARCHAR ( 50 ),
  language VARCHAR ( 50 ),
  date_death_recorded DATE,
  sentence_length VARCHAR ( 80 ),
  on_count BOOLEAN,
  transfer_date DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

const CREATE_JOIN_TABLE_QUERY = `CREATE TABLE cases_${TABLE} (
  case_inmate_id serial PRIMARY KEY,
  case_id INTEGER,
  inmate_id VARCHAR ( 10 ),
  role_on_case enum_cases_officers_role_on_case,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(CREATE_TABLE_QUERY, {
          transaction
        });
        await queryInterface.sequelize.query(CREATE_JOIN_TABLE_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while creating ${TABLE} table. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(
          `DROP TABLE IF EXISTS cases_${TABLE}`,
          {
            transaction
          }
        );
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS ${TABLE}`, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while removing ${TABLE} table. Internal Error: ${error}`
      );
    }
  }
};
