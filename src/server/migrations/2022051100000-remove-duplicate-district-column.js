"use strict";

const ADD_COLUMN_QUERY = `ALTER TABLE cases 
  ADD COLUMN IF NOT EXISTS district`;

const REMOVE_COLUMN_QUERY = `ALTER TABLE cases 
  DROP COLUMN IF EXISTS district`;

const SELECT_DISTRICT_QUERY =  `
  select d.id as district_id, c.id as case_id
    from cases c
      join districts d
        on CASE
          when c.district = 'First District' then '1st District'
          when c.district = 'Second District' then '2nd District'
          when c.district = 'Third District' then '3rd District'
          when c.district = 'Fourth District' then '4th District'
          when c.district = 'Fifth District' then '5th District'
          when c.district = 'Sixth District' then '6th District'
          when c.district = 'Seventh District' then '7th District'
          when c.district = 'Eighth District' then '8th District'
        end = d.name
    where c.district is not null and c.district_id is NULL`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        const cases = await queryInterface.sequelize.query(SELECT_DISTRICT_QUERY, {
          transaction
        });
        cases[0].forEach(c => {
          queryInterface.sequelize.query(
            `UPDATE cases SET district_id = ${c.district_id} WHERE id = ${c.case_id}`
          );
        });
        await queryInterface.sequelize.query(REMOVE_COLUMN_QUERY, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while restructuring cases table to remove duplicate district. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(ADD_COLUMN_QUERY, {
          transaction
        });
      });
    } catch (error) {
      throw new Error(
        `Error while rolling back district duplicate update. Internal Error: ${error}`
      );
    }
  }
};
