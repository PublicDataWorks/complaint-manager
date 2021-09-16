"use strict";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const sortableCasesViewWithoutMultipleAccused = `CREATE VIEW sortable_cases_view AS
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
                        WHEN case_employee_type = '${PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription}'
                        THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD.description}'
                        WHEN officer_id IS NULL THEN '${PERSON_TYPE.UNKNOWN_OFFICER.description}'
                        ELSE '${PERSON_TYPE.KNOWN_OFFICER.description}'
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
                       '${PERSON_TYPE.CIVILIAN.description}' AS complainant_person_type,
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
                                     WHEN case_employee_type = '${PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription}'
                                     THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD.description}'
                                     WHEN officer_id IS NULL
                                     THEN '${PERSON_TYPE.UNKNOWN_OFFICER.description}'
                                     ELSE '${PERSON_TYPE.KNOWN_OFFICER.description}'
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

const sortableCasesViewWithMultipleAccused = `CREATE VIEW sortable_cases_view AS (
  SELECT
      cases.id,
      array_agg(
        cast(tagDetails.name as text)
        order by
          upper(tagDetails.name) ASC
      ) as tag_names,
      complaint_type,
      case_number,
      YEAR,
      status,
      first_contact_date,
      assigned_to,
      deleted_at,
      json_agg(
        accused_officers
        ORDER BY accused_last_name NULLS LAST, accused_first_name, accused_middle_name
      ) as accused_officers,
      primary_complainant.complainant_first_name,
      primary_complainant.complainant_middle_name,
      primary_complainant.complainant_last_name,
      primary_complainant.complainant_suffix,
      primary_complainant.complainant_person_type,
      primary_complainant.complainant_is_anonymous
    FROM
      cases
      LEFT JOIN (
        SELECT
          case_id, 
          officers.id as case_officer_id,
          CASE
            WHEN case_employee_type = '${PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription}'
            THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD.description}'
            WHEN officer_id IS NULL THEN '${PERSON_TYPE.UNKNOWN_OFFICER.description}'
            ELSE '${PERSON_TYPE.KNOWN_OFFICER.description}'
          END AS accused_person_type,
          officer_id AS accused_officer_id,
          first_name AS accused_first_name,
          middle_name AS accused_middle_name,
          last_name AS accused_last_name
        FROM
          cases_officers AS officers
        WHERE
          officers.role_on_case = 'Accused' AND officers.deleted_at IS NULL
      ) AS accused_officers ON cases.id = accused_officers.case_id
      LEFT JOIN (
        SELECT
          case_id,
          first_name AS complainant_first_name,
          middle_name AS complainant_middle_name,
          last_name AS complainant_last_name,
          suffix AS complainant_suffix,
          complainant_person_type,
          is_anonymous AS complainant_is_anonymous
        FROM
          (
            SELECT
              case_id,
              first_name,
              middle_initial AS middle_name,
              last_name,
              suffix,
              '${PERSON_TYPE.CIVILIAN.description}' AS complainant_person_type,
              is_anonymous,
              created_at
            FROM
              civilians c
            WHERE
              role_on_case = 'Complainant'
              AND deleted_at IS NULL
            UNION ALL
            SELECT
              case_id,
              first_name,
              middle_name,
              last_name,
              NULL AS suffix,
              CASE
                WHEN case_employee_type = '${PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription}'
                THEN '${PERSON_TYPE.CIVILIAN_WITHIN_PD.description}'
                WHEN officer_id IS NULL
                THEN '${PERSON_TYPE.UNKNOWN_OFFICER.description}'
                ELSE '${PERSON_TYPE.KNOWN_OFFICER.description}'
              END AS complainant_person_type,
              is_anonymous,
              created_at
            FROM
              cases_officers co
            WHERE
              role_on_case = 'Complainant'
              AND deleted_at IS NULL
          ) c
        WHERE
          c.created_at = (
            SELECT
              MIN(created_at) AS created_at
            FROM
              (
                SELECT
                  case_id,
                  created_at
                FROM
                  civilians c
                WHERE
                  role_on_case = 'Complainant'
                  AND deleted_at IS NULL
                UNION ALL
                SELECT
                  case_id,
                  created_at
                FROM
                  cases_officers co
                WHERE
                  role_on_case = 'Complainant'
                  AND deleted_at IS NULL
              ) cc
            WHERE
              cc.case_id = c.case_id
          )
      ) AS primary_complainant ON cases.id = primary_complainant.case_id
      LEFT JOIN (
        SELECT
          case_id,
          tag_id
        FROM
          case_tags
      ) AS caseTags ON cases.id = caseTags.case_id
      LEFT JOIN (
        select
          id,
          name
        FROM
          tags
      ) AS tagDetails ON tagDetails.id = caseTags.tag_id
    GROUP BY
      cases.id,
      primary_complainant.complainant_first_name,
      primary_complainant.complainant_middle_name,
      primary_complainant.complainant_last_name,
      primary_complainant.complainant_suffix,
      primary_complainant.complainant_person_type,
      primary_complainant.complainant_is_anonymous
  );`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const viewName = "sortable_cases_view";

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP VIEW ${viewName}`, { transaction })
          .then(async () => {
            await queryInterface.sequelize.query(
              sortableCasesViewWithMultipleAccused,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while case reference from cases and sortable cases view. Internal Error: ${error}`
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
              sortableCasesViewWithoutMultipleAccused,
              {
                transaction
              }
            );
          });
      });
    } catch (error) {
      throw new Error(
        `Error while case reference from cases and sortable cases view. Internal Error: ${error}`
      );
    }
  }
};
