"use strict";

const UPDATE_VIEW = `CREATE OR REPLACE VIEW sortable_cases_view AS
SELECT cases.id,
    array_agg((tagdetails.name)::text ORDER BY (upper((tagdetails.name)::text))) AS tag_names,
    complaint_type.name as complaint_type,
    cases.case_number,
    cases.year,
    case_status.name as status,
    case_status.order_key as status_order_key,
    cases.first_contact_date,
    cases.assigned_to,
    cases.deleted_at,
    json_agg(accused_officers.* ORDER BY accused_officers.accused_last_name, accused_officers.accused_first_name, accused_officers.accused_middle_name) AS accused_officers,
    primary_complainant.complainant_first_name,
    primary_complainant.complainant_middle_name,
    primary_complainant.complainant_last_name,
    primary_complainant.complainant_suffix,
    primary_complainant.complainant_person_type,
    primary_complainant.complainant_is_anonymous
   FROM ((((cases
   	 LEFT JOIN case_statuses case_status ON cases.status = case_status.id
   	 LEFT JOIN complaint_types complaint_type ON cases.complaint_type_id = complaint_type.id
     LEFT JOIN ( SELECT officers.case_id,
            officers.id AS case_officer_id,
                CASE
                    WHEN ((officers.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                    WHEN (officers.officer_id IS NULL) THEN 'Unknown Officer'::text
                    ELSE 'Known Officer'::text
                END AS accused_person_type,
            officers.officer_id AS accused_officer_id,
            officers.first_name AS accused_first_name,
            officers.middle_name AS accused_middle_name,
            officers.last_name AS accused_last_name
           FROM cases_officers officers
          WHERE ((officers.role_on_case = 'Accused'::enum_cases_officers_role_on_case) AND (officers.deleted_at IS NULL))) accused_officers ON ((cases.id = accused_officers.case_id)))
     LEFT JOIN ( SELECT c.case_id,
            c.first_name AS complainant_first_name,
            c.middle_name AS complainant_middle_name,
            c.last_name AS complainant_last_name,
            c.suffix AS complainant_suffix,
            c.complainant_person_type,
            c.is_anonymous AS complainant_is_anonymous
           FROM ( SELECT c_1.case_id,
                    c_1.first_name,
                    c_1.middle_initial AS middle_name,
                    c_1.last_name,
                    c_1.suffix,
                    c_1.person_type::TEXT AS complainant_person_type,
                    c_1.is_anonymous,
                    c_1.created_at
                   FROM civilians c_1
                  WHERE ((c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                UNION ALL
                 SELECT co.case_id,
                    co.first_name,
                    co.middle_name,
                    co.last_name,
                    NULL::character varying AS suffix,
                        CASE
                            WHEN ((co.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                            WHEN (co.officer_id IS NULL) THEN 'Unknown Officer'::text
                            ELSE 'Known Officer'::text
                        END AS complainant_person_type,
                    co.is_anonymous,
                    co.created_at
                   FROM cases_officers co
                  WHERE ((co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))
                UNION ALL
                 SELECT ci.case_id,
                    i.first_name,
                    NULL::CHARACTER AS middle_name,
                    i.last_name,
                    NULL::character varying AS suffix,
                    'PERSON_IN_CUSTODY'::TEXT AS complainant_person_type,
                    ci.is_anonymous,
                    ci.created_at
                   FROM cases_inmates ci LEFT JOIN inmates i ON ci.inmate_id = i.inmate_id
                  WHERE ((ci.role_on_case = 'Complainant') AND (ci.deleted_at IS NULL))) c
          WHERE (c.created_at = ( SELECT min(cc.created_at) AS created_at
                   FROM ( SELECT c_1.case_id,
                            c_1.created_at
                           FROM civilians c_1
                          WHERE ((c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                        UNION ALL
                         SELECT co.case_id,
                            co.created_at
                           FROM cases_officers co
                          WHERE ((co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))
                        UNION ALL
                         SELECT ci.case_id,
                            ci.created_at
                           FROM cases_inmates ci
                          WHERE ((ci.role_on_case = 'Complainant') AND (ci.deleted_at IS NULL))) cc
                  WHERE (cc.case_id = c.case_id)))) primary_complainant ON ((cases.id = primary_complainant.case_id)))
     LEFT JOIN ( SELECT case_tags.case_id,
            case_tags.tag_id
           FROM case_tags) casetags ON ((cases.id = casetags.case_id)))
     LEFT JOIN ( SELECT tags.id,
            tags.name
           FROM tags) tagdetails ON ((tagdetails.id = casetags.tag_id)))
  GROUP BY cases.id, complaint_type.name, primary_complainant.complainant_first_name, primary_complainant.complainant_middle_name, primary_complainant.complainant_last_name, primary_complainant.complainant_suffix, primary_complainant.complainant_person_type, primary_complainant.complainant_is_anonymous, case_status.name, case_status.order_key`;

const REVERT_VIEW = `CREATE OR REPLACE VIEW sortable_cases_view AS
SELECT cases.id,
    array_agg((tagdetails.name)::text ORDER BY (upper((tagdetails.name)::text))) AS tag_names,
    complaint_type.name as complaint_type,
    cases.case_number,
    cases.year,
    case_status.name as status,
    case_status.order_key as status_order_key,
    cases.first_contact_date,
    cases.assigned_to,
    cases.deleted_at,
    json_agg(accused_officers.* ORDER BY accused_officers.accused_last_name, accused_officers.accused_first_name, accused_officers.accused_middle_name) AS accused_officers,
    primary_complainant.complainant_first_name,
    primary_complainant.complainant_middle_name,
    primary_complainant.complainant_last_name,
    primary_complainant.complainant_suffix,
    primary_complainant.complainant_person_type,
    primary_complainant.complainant_is_anonymous
   FROM ((((cases
   	 LEFT JOIN case_statuses case_status ON cases.status = case_status.id
   	 LEFT JOIN complaint_types complaint_type ON cases.complaint_type_id = complaint_type.id
     LEFT JOIN ( SELECT officers.case_id,
            officers.id AS case_officer_id,
                CASE
                    WHEN ((officers.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                    WHEN (officers.officer_id IS NULL) THEN 'Unknown Officer'::text
                    ELSE 'Known Officer'::text
                END AS accused_person_type,
            officers.officer_id AS accused_officer_id,
            officers.first_name AS accused_first_name,
            officers.middle_name AS accused_middle_name,
            officers.last_name AS accused_last_name
           FROM cases_officers officers
          WHERE ((officers.role_on_case = 'Accused'::enum_cases_officers_role_on_case) AND (officers.deleted_at IS NULL))) accused_officers ON ((cases.id = accused_officers.case_id)))
     LEFT JOIN ( SELECT c.case_id,
            c.first_name AS complainant_first_name,
            c.middle_name AS complainant_middle_name,
            c.last_name AS complainant_last_name,
            c.suffix AS complainant_suffix,
            c.complainant_person_type,
            c.is_anonymous AS complainant_is_anonymous
           FROM ( SELECT c_1.case_id,
                    c_1.first_name,
                    c_1.middle_initial AS middle_name,
                    c_1.last_name,
                    c_1.suffix,
                    'Civilian'::text AS complainant_person_type,
                    c_1.is_anonymous,
                    c_1.created_at
                   FROM civilians c_1
                  WHERE ((c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                UNION ALL
                 SELECT co.case_id,
                    co.first_name,
                    co.middle_name,
                    co.last_name,
                    NULL::character varying AS suffix,
                        CASE
                            WHEN ((co.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                            WHEN (co.officer_id IS NULL) THEN 'Unknown Officer'::text
                            ELSE 'Known Officer'::text
                        END AS complainant_person_type,
                    co.is_anonymous,
                    co.created_at
                   FROM cases_officers co
                  WHERE ((co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))) c
          WHERE (c.created_at = ( SELECT min(cc.created_at) AS created_at
                   FROM ( SELECT c_1.case_id,
                            c_1.created_at
                           FROM civilians c_1
                          WHERE ((c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                        UNION ALL
                         SELECT co.case_id,
                            co.created_at
                           FROM cases_officers co
                          WHERE ((co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))) cc
                  WHERE (cc.case_id = c.case_id)))) primary_complainant ON ((cases.id = primary_complainant.case_id)))
     LEFT JOIN ( SELECT case_tags.case_id,
            case_tags.tag_id
           FROM case_tags) casetags ON ((cases.id = casetags.case_id)))
     LEFT JOIN ( SELECT tags.id,
            tags.name
           FROM tags) tagdetails ON ((tagdetails.id = casetags.tag_id)))
  GROUP BY cases.id, complaint_type.name, primary_complainant.complainant_first_name, primary_complainant.complainant_middle_name, primary_complainant.complainant_last_name, primary_complainant.complainant_suffix, primary_complainant.complainant_person_type, primary_complainant.complainant_is_anonymous, case_status.name, case_status.order_key`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(UPDATE_VIEW, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while updating sortable_cases_view. Internal Error: ${error}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize.query(REVERT_VIEW, { transaction });
      });
    } catch (error) {
      throw new Error(
        `Error while reverting change to sortable_cases_view. Internal Error: ${error}`
      );
    }
  }
};
