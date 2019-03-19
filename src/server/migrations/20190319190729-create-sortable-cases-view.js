"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `CREATE VIEW sortable_cases_view AS
        (SELECT id,
               complaint_type,
               case_number,
               YEAR,
               status,
               first_contact_date,
               assigned_to,
               accused_officers.accused_officer_id,
               accused_officers.accused_first_name,
               accused_officers.accused_middle_name,
               accused_officers.accused_last_name,
               primary_complainant.complainant_first_name,
               primary_complainant.complainant_middle_name,
               primary_complainant.complainant_last_name,
               primary_complainant.complainant_type
        FROM cases
        LEFT JOIN
          (SELECT case_id,
                  id AS accused_officer_id,
                  first_name AS accused_first_name,
                  middle_name AS accused_middle_name,
                  last_name AS accused_last_name
           FROM cases_officers AS officers
           WHERE officers.role_on_case = 'Accused'
             AND officers.created_at =
               (SELECT MIN(created_at)
                FROM cases_officers AS earliest_officer
                WHERE earliest_officer.role_on_case = 'Accused'
                  AND officers.case_id = earliest_officer.case_id)) AS accused_officers ON cases.id = accused_officers.case_id
        LEFT JOIN
          (SELECT case_id,
                  first_name AS complainant_first_name,
                  middle_name AS complainant_middle_name,
                  last_name AS complainant_last_name,
                  complainant_type
           FROM
             (SELECT case_id,
                     first_name,
                     middle_initial AS middle_name,
                     last_name,
                     'Civilian' AS complainant_type,
                     created_at
              FROM civilians c
              WHERE role_on_case = 'Complainant'
                AND deleted_at IS NULL
              UNION ALL SELECT case_id,
                               first_name,
                               middle_name,
                               last_name,
                               'Officer' AS complainant_type,
                               created_at
              FROM cases_officers co
              WHERE role_on_case = 'Complainant'
                AND deleted_at IS NULL) c
           WHERE c.created_at =
               (SELECT MIN(created_at) AS created_at
                FROM
                  (SELECT case_id,
                          created_at
                   FROM civilians c
                   WHERE role_on_case = 'Complainant'
                     AND deleted_at IS NULL
                   UNION ALL SELECT case_id,
                                    created_at
                   FROM cases_officers co
                   WHERE role_on_case = 'Complainant'
                     AND deleted_at IS NULL) cc
                WHERE cc.case_id = c.case_id)) AS primary_complainant ON cases.id = primary_complainant.case_id);`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP VIEW sortable_cases_view`);
  }
};
