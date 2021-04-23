"use strict";

import { EMPLOYEE_TYPE, PERSON_TYPE } from "../../instance-files/constants";

const sortableCasesViewWithRemovedAccusedOfficer = `CREATE VIEW sortable_cases_view AS
          (SELECT id,
                 complaint_type,
                 case_number,
                 YEAR,
                 status,
                 first_contact_date,
                 assigned_to,
                 deleted_at,
                 accused_officers.accused_first_name,
                 accused_officers.accused_middle_name,
                 accused_officers.accused_last_name,
                 accused_officers.accused_person_type,
                 primary_complainant.complainant_first_name,
                 primary_complainant.complainant_middle_name,
                 primary_complainant.complainant_last_name,
                 primary_complainant.complainant_suffix,
                 primary_complainant.complainant_person_type,
                 primary_complainant.complainant_is_anonymous
          FROM cases
          LEFT JOIN
            (SELECT case_id,
                    CASE
                        WHEN case_employee_type = '${EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD}'
                        THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD}'
                        WHEN officer_id IS NULL THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                        ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                    END AS accused_person_type,
                    officer_id AS accused_officer_id,
                    first_name AS accused_first_name,
                    middle_name AS accused_middle_name,
                    last_name AS accused_last_name
             FROM cases_officers AS officers
             WHERE officers.role_on_case = 'Accused'
               AND officers.created_at =
                 (SELECT MIN(created_at)
                  FROM cases_officers AS earliest_officer
                  WHERE earliest_officer.role_on_case = 'Accused'
                    AND officers.case_id = earliest_officer.case_id))
                    AS accused_officers
          ON cases.id = accused_officers.case_id
          LEFT JOIN
            (SELECT case_id,
                    first_name AS complainant_first_name,
                    middle_name AS complainant_middle_name,
                    last_name AS complainant_last_name,
                    suffix AS complainant_suffix,
                    complainant_person_type,
                    is_anonymous AS complainant_is_anonymous
             FROM
               (SELECT case_id,
                       first_name,
                       middle_initial AS middle_name,
                       last_name,
                       suffix,
                       '${PERSON_TYPE.CIVILIAN}' AS complainant_person_type,
                       is_anonymous,
                       created_at
                FROM civilians c
                WHERE role_on_case = 'Complainant'
                  AND deleted_at IS NULL
                UNION ALL SELECT case_id,
                                 first_name,
                                 middle_name,
                                 last_name,
                                 NULL AS suffix,
                                 CASE
                                     WHEN case_employee_type = '${EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD}'
                                     THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD}'
                                     WHEN officer_id IS NULL
                                     THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                                     ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                                 END AS complainant_person_type,
                                 is_anonymous,
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
                  WHERE cc.case_id = c.case_id)) AS primary_complainant
          ON cases.id = primary_complainant.case_id);`;

const sortableCasesViewWithoutRemovedAccusedOfficer = `CREATE VIEW sortable_cases_view AS
          (SELECT id,
                 complaint_type,
                 case_number,
                 YEAR,
                 status,
                 first_contact_date,
                 assigned_to,
                 deleted_at,
                 accused_officers.accused_first_name,
                 accused_officers.accused_middle_name,
                 accused_officers.accused_last_name,
                 accused_officers.accused_person_type,
                 primary_complainant.complainant_first_name,
                 primary_complainant.complainant_middle_name,
                 primary_complainant.complainant_last_name,
                 primary_complainant.complainant_suffix,
                 primary_complainant.complainant_person_type,
                 primary_complainant.complainant_is_anonymous
          FROM cases
          LEFT JOIN
            (SELECT case_id,
                    CASE
                        WHEN case_employee_type = '${EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD}'
                        THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD}'
                        WHEN officer_id IS NULL THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                        ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                    END AS accused_person_type,
                    officer_id AS accused_officer_id,
                    first_name AS accused_first_name,
                    middle_name AS accused_middle_name,
                    last_name AS accused_last_name
             FROM cases_officers AS officers
             WHERE officers.role_on_case = 'Accused' AND officers.deleted_at IS NULL
               AND officers.created_at =
                 (SELECT MIN(created_at)
                  FROM cases_officers AS earliest_officer
                  WHERE earliest_officer.role_on_case = 'Accused' AND earliest_officer.deleted_at IS NULL
                    AND officers.case_id = earliest_officer.case_id))
                    AS accused_officers
          ON cases.id = accused_officers.case_id
          LEFT JOIN
            (SELECT case_id,
                    first_name AS complainant_first_name,
                    middle_name AS complainant_middle_name,
                    last_name AS complainant_last_name,
                    suffix AS complainant_suffix,
                    complainant_person_type,
                    is_anonymous AS complainant_is_anonymous
             FROM
               (SELECT case_id,
                       first_name,
                       middle_initial AS middle_name,
                       last_name,
                       suffix,
                       '${PERSON_TYPE.CIVILIAN}' AS complainant_person_type,
                       is_anonymous,
                       created_at
                FROM civilians c
                WHERE role_on_case = 'Complainant'
                  AND deleted_at IS NULL
                UNION ALL SELECT case_id,
                                 first_name,
                                 middle_name,
                                 last_name,
                                 NULL AS suffix,
                                 CASE
                                     WHEN case_employee_type = '${EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD}'
                                     THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD}'
                                     WHEN officer_id IS NULL
                                     THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                                     ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                                 END AS complainant_person_type,
                                 is_anonymous,
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
                  WHERE cc.case_id = c.case_id)) AS primary_complainant
          ON cases.id = primary_complainant.case_id);`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const viewName = "sortable_cases_view";

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP VIEW ${viewName}`, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              sortableCasesViewWithoutRemovedAccusedOfficer,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while transforming sortable cases view. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const viewName = "sortable_cases_view";
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP VIEW ${viewName}`, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              sortableCasesViewWithRemovedAccusedOfficer,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while transforming sortable cases view. Internal Error: ${error}`
      );
    }
  }
};
