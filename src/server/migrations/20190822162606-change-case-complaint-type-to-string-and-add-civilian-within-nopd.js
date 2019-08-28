"use strict";

import {
  AUDIT_ACTION,
  CIVILIAN_INITIATED,
  CIVILIAN_WITHIN_NOPD_INITIATED,
  PERSON_TYPE,
  RANK_INITIATED
} from "../../sharedUtilities/constants";
import models from "../models";

const recreateOldSortableCasesQuery = `CREATE VIEW sortable_cases_view AS
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
                 primary_complainant.complainant_person_type
          FROM cases
          LEFT JOIN
            (SELECT case_id,
                    CASE
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
                    complainant_person_type
             FROM
               (SELECT case_id,
                       first_name,
                       middle_initial AS middle_name,
                       last_name,
                       suffix,
                       '${PERSON_TYPE.CIVILIAN}' AS complainant_person_type,
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
                                     WHEN officer_id IS NULL
                                     THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                                     ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                                 END AS complainant_person_type,
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

const createNewSortableCasesQuery = `CREATE VIEW sortable_cases_view AS
          (SELECT id,
                 complaint_type,
                 case_number,
                 case_reference,
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
                 primary_complainant.complainant_person_type
          FROM cases
          LEFT JOIN
            (SELECT case_id,
                    CASE
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
                    complainant_person_type
             FROM
               (SELECT case_id,
                       first_name,
                       middle_initial AS middle_name,
                       last_name,
                       suffix,
                       '${PERSON_TYPE.CIVILIAN}' AS complainant_person_type,
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
                                     WHEN officer_id IS NULL
                                     THEN '${PERSON_TYPE.UNKNOWN_OFFICER}'
                                     ELSE '${PERSON_TYPE.KNOWN_OFFICER}'
                                 END AS complainant_person_type,
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
    const Op = models.Sequelize.Op;
    const viewName = "sortable_cases_view";
    const tableName = "cases";
    const columnName = "complaint_type";
    const defaultValue = CIVILIAN_INITIATED;
    const enumName = `enum_${tableName}_${columnName}`;

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(`DROP VIEW ${viewName}`, {
            transaction
          })
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE text USING (${columnName}::text)`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(`DROP TYPE ${enumName}`, {
              transaction
            })
          )
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET DEFAULT '${defaultValue}'`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(createNewSortableCasesQuery, {
              transaction
            })
          );

        await models.cases.update(
          {
            complaintType: CIVILIAN_WITHIN_NOPD_INITIATED
          },
          {
            where: { caseReference: { [Op.startsWith]: "CN" } },
            transaction,
            auditUser: "PROGRAMMATIC SQL MIGRATION"
          }
        );
      });
    } catch (error) {
      throw new Error(
        `Error while transforming complaint_type ENUM to string. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const viewName = "sortable_cases_view";
    const tableName = "cases";
    const columnName = "complaint_type";
    const enumValues = [CIVILIAN_INITIATED, RANK_INITIATED];
    const defaultValue = CIVILIAN_INITIATED;
    const enumName = `enum_${tableName}_${columnName}`;

    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await models.cases.update(
          {
            complaintType: RANK_INITIATED
          },
          {
            where: {
              complaintType: CIVILIAN_WITHIN_NOPD_INITIATED
            },
            transaction,
            auditUser: "PROGRAMMATIC SQL MIGRATION"
          }
        );

        await queryInterface.sequelize
          .query(
            `CREATE TYPE ${enumName} AS ENUM ('${enumValues.join("', '")}')`,
            { transaction }
          )
          .then(() =>
            queryInterface.sequelize.query(`DROP VIEW ${viewName}`, {
              transaction
            })
          )
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP DEFAULT`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE ${enumName} USING (${columnName}::text::${enumName})`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(
              `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET DEFAULT '${defaultValue}'::${enumName}`,
              { transaction }
            )
          )
          .then(() =>
            queryInterface.sequelize.query(recreateOldSortableCasesQuery, {
              transaction
            })
          );
      });
    } catch (error) {
      throw new Error(
        `Error while transforming complaint_type string to ENUM. Internal Error: ${error}`
      );
    }
  }
};
