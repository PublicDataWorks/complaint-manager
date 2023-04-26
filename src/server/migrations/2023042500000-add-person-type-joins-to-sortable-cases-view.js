"use strict";

const UPDATE_VIEW = `CREATE OR REPLACE VIEW public.sortable_cases_view
AS SELECT cases.id,
  array_agg(tagdetails.name::text ORDER BY (upper(tagdetails.name::text))) AS tag_names,
  complaint_type.name AS complaint_type,
  cases.case_number,
  cases.year,
  case_status.name AS status,
  case_status.order_key AS status_order_key,
  cases.first_contact_date,
  cases.assigned_to,
  cases.deleted_at,
  json_agg(accused_officers.* ORDER BY accused_officers.accused_last_name, accused_officers.accused_first_name, accused_officers.accused_middle_name) AS accused_officers,
  primary_complainant.complainant_first_name,
  primary_complainant.complainant_middle_name,
  primary_complainant.complainant_last_name,
  primary_complainant.complainant_suffix,
  CASE
    WHEN primary_complainant.complainant_person_type IS NULL THEN default_person_type.description
    ELSE primary_complainant.complainant_person_type
  END AS complainant_person_type,
  primary_complainant.complainant_is_anonymous,
  CASE
    WHEN primary_complainant.complainant_abbreviation IS NULL THEN default_person_type.abbreviation
    ELSE primary_complainant.complainant_abbreviation
  END AS complainant_abbreviation
  FROM cases
   LEFT JOIN case_statuses case_status ON cases.status = case_status.id
   LEFT JOIN complaint_types complaint_type ON cases.complaint_type_id = complaint_type.id
   LEFT JOIN person_types default_person_type ON default_person_type.is_default = true
   LEFT JOIN ( SELECT officers.case_id,
      pt.description AS accused_person_type,
      officers.first_name AS accused_first_name,
      officers.middle_name AS accused_middle_name,
      officers.last_name AS accused_last_name
      FROM cases_officers officers LEFT JOIN person_types pt ON officers.person_type = pt.key
     WHERE officers.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND officers.deleted_at IS null
  	UNION ALL
	 SELECT c.case_id,
	  CASE WHEN civ_pt.description IS NULL
	    THEN 'Civilian'::TEXT
        ELSE civ_pt.description
      END AS accused_person_type,
      c.first_name AS accused_first_name,
      c.middle_initial AS accused_middle_name,
      c.last_name AS accused_last_name
      FROM civilians c
      LEFT JOIN person_types civ_pt ON c.person_type = civ_pt.key
     WHERE c.role_on_case = 'Accused'::enum_civilians_role_on_case AND c.deleted_at IS null
    UNION ALL
	 SELECT ci.case_id,
      CASE WHEN ci_pt.description IS NULL
        THEN 'PERSON_IN_CUSTODY'::TEXT
        ELSE ci_pt.description
      END AS accused_person_type,
      ci.first_name AS accused_first_name,
      ci.middle_initial AS accused_middle_name,
      ci.last_name AS accused_last_name
      FROM cases_inmates ci
      LEFT JOIN person_types ci_pt ON ci.person_type_key = ci_pt.key
     WHERE ci.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND ci.inmate_id IS null AND ci.deleted_at IS null
     UNION ALL
	 	 SELECT ci.case_id,
      'PERSON_IN_CUSTODY'::text AS accused_person_type,
      i.first_name AS accused_first_name,
      null AS accused_middle_name,
      i.last_name AS accused_last_name
      FROM cases_inmates ci
      JOIN inmates i ON ci.inmate_id::text = i.inmate_id::text
     WHERE ci.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND ci.deleted_at IS null) accused_officers ON cases.id = accused_officers.case_id
   LEFT JOIN ( SELECT c.case_id,
      c.first_name AS complainant_first_name,
      c.middle_name AS complainant_middle_name,
      c.last_name AS complainant_last_name,
      c.suffix AS complainant_suffix,
      c.complainant_person_type,
      c.complainant_abbreviation,
      c.is_anonymous AS complainant_is_anonymous
      FROM ( SELECT c_1.case_id,
          c_1.first_name,
          c_1.middle_initial AS middle_name,
          c_1.last_name,
          c_1.suffix,
          CASE WHEN cc_pt.description IS NULL
            THEN 'Civilian'::TEXT
            ELSE cc_pt.description 
          END AS complainant_person_type,
          cc_pt.abbreviation AS complainant_abbreviation,
          c_1.is_anonymous,
          c_1.created_at
          FROM civilians c_1
          LEFT JOIN person_types cc_pt ON c_1.person_type = cc_pt.key
         WHERE c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case AND c_1.deleted_at IS NULL
        UNION ALL
         SELECT co.case_id,
          co.first_name,
          co.middle_name,
          co.last_name,
          NULL::character varying AS suffix,
            CASE
              WHEN cco_pt.description IS NULL AND co.case_employee_type::TEXT = 'Civilian Within NOPD'::TEXT THEN 'Civilian (NOPD)'::TEXT
              WHEN cco_pt.description IS NULL AND co.officer_id IS NULL THEN 'Unknown Officer'::TEXT
              WHEN cco_pt.description IS NULL THEN 'Known Officer'::TEXT
              ELSE cco_pt.description
            END AS complainant_person_type,
          cco_pt.abbreviation AS complainant_abbreviation,
          co.is_anonymous,
          co.created_at
          FROM cases_officers co
          LEFT JOIN person_types cco_pt ON co.person_type = cco_pt."key"
         WHERE co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND co.deleted_at IS NULL
        UNION ALL
         SELECT ci.case_id,
          i.first_name,
          NULL::character(1) AS middle_name,
          i.last_name,
          NULL::character varying AS suffix,
          CASE
	        WHEN cci_pt.description IS NULL THEN 'Person in Custody'::TEXT
	        ELSE cci_pt.description
          END AS complainant_person_type,
          cci_pt.abbreviation AS complainant_abbreviation,
          ci.is_anonymous,
          ci.created_at
          FROM cases_inmates ci
           JOIN inmates i ON ci.inmate_id::text = i.inmate_id::TEXT
           LEFT JOIN person_types cci_pt ON ci.person_type_key = cci_pt.key
         WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.deleted_at IS NULL
        UNION ALL
         SELECT ci.case_id,
          ci.first_name,
          ci.middle_initial AS middle_name,
          ci.last_name,
          ci.suffix,
          CASE
	        WHEN cci_pt.description IS NULL THEN 'Person in Custody'::TEXT
	        ELSE cci_pt.description
          END AS complainant_person_type,
          cci_pt.abbreviation AS complainant_abbreviation,
          ci.is_anonymous,
          ci.created_at
          FROM cases_inmates ci
           LEFT JOIN person_types cci_pt ON ci.person_type_key = cci_pt.key
         WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.inmate_id IS NULL AND ci.deleted_at IS NULL) c
     WHERE c.created_at = (( SELECT min(cc.created_at) AS created_at
          FROM ( SELECT c_1.case_id,
              c_1.created_at
              FROM civilians c_1
             WHERE c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case AND c_1.deleted_at IS NULL
            UNION ALL
             SELECT co.case_id,
              co.created_at
              FROM cases_officers co
             WHERE co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND co.deleted_at IS NULL
            UNION ALL
             SELECT ci.case_id,
              ci.created_at
              FROM cases_inmates ci
             WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.deleted_at IS NULL) cc
         WHERE cc.case_id = c.case_id))) primary_complainant ON cases.id = primary_complainant.case_id
   LEFT JOIN ( SELECT case_tags.case_id,
      case_tags.tag_id
      FROM case_tags) casetags ON cases.id = casetags.case_id
   LEFT JOIN ( SELECT tags.id,
      tags.name
      FROM tags) tagdetails ON tagdetails.id = casetags.tag_id
 GROUP BY 
   cases.id, 
   complaint_type.name, 
   primary_complainant.complainant_first_name, 
   primary_complainant.complainant_middle_name, 
   primary_complainant.complainant_last_name, 
   primary_complainant.complainant_suffix, 
   primary_complainant.complainant_person_type, 
   primary_complainant.complainant_is_anonymous, 
   primary_complainant.complainant_abbreviation, 
   case_status.name, 
   case_status.order_key, 
   default_person_type.description, 
   default_person_type.abbreviation;`;

const REVERT_VIEW = `CREATE OR REPLACE VIEW public.sortable_cases_view
AS SELECT cases.id,
  array_agg(tagdetails.name::text ORDER BY (upper(tagdetails.name::text))) AS tag_names,
  complaint_type.name AS complaint_type,
  cases.case_number,
  cases.year,
  case_status.name AS status,
  case_status.order_key AS status_order_key,
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
  FROM cases
   LEFT JOIN case_statuses case_status ON cases.status = case_status.id
   LEFT JOIN complaint_types complaint_type ON cases.complaint_type_id = complaint_type.id
   LEFT JOIN ( SELECT officers.case_id,
        CASE
          WHEN officers.case_employee_type::text = 'Civilian Within NOPD'::text THEN 'Civilian (NOPD)'::text
          WHEN officers.officer_id IS NULL THEN 'Unknown Officer'::text
          ELSE 'Known Officer'::text
        END AS accused_person_type,
      officers.first_name AS accused_first_name,
      officers.middle_name AS accused_middle_name,
      officers.last_name AS accused_last_name
      FROM cases_officers officers
     WHERE officers.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND officers.deleted_at IS null
  	UNION ALL
	 	 SELECT c.case_id,
      c.person_type AS accused_person_type,
      c.first_name AS accused_first_name,
      c.middle_initial AS accused_middle_name,
      c.last_name AS accused_last_name
      FROM civilians c
     WHERE c.role_on_case = 'Accused'::enum_civilians_role_on_case AND c.deleted_at IS null
       	UNION ALL
	 	 SELECT ci.case_id,
      'PERSON_IN_CUSTODY'::text AS accused_person_type,
      ci.first_name AS accused_first_name,
      ci.middle_initial AS accused_middle_name,
      ci.last_name AS accused_last_name
      FROM cases_inmates ci
     WHERE ci.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND ci.inmate_id IS null AND ci.deleted_at IS null
     UNION ALL
	 	 SELECT ci.case_id,
      'PERSON_IN_CUSTODY'::text AS accused_person_type,
      i.first_name AS accused_first_name,
      null AS accused_middle_name,
      i.last_name AS accused_last_name
      FROM cases_inmates ci
      JOIN inmates i ON ci.inmate_id::text = i.inmate_id::text
     WHERE ci.role_on_case = 'Accused'::enum_cases_officers_role_on_case AND ci.deleted_at IS null) accused_officers ON cases.id = accused_officers.case_id
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
          c_1.person_type::text AS complainant_person_type,
          c_1.is_anonymous,
          c_1.created_at
          FROM civilians c_1
         WHERE c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case AND c_1.deleted_at IS NULL
        UNION ALL
         SELECT co.case_id,
          co.first_name,
          co.middle_name,
          co.last_name,
          NULL::character varying AS suffix,
            CASE
              WHEN co.case_employee_type::text = 'Civilian Within NOPD'::text THEN 'Civilian (NOPD)'::text
              WHEN co.officer_id IS NULL THEN 'Unknown Officer'::text
              ELSE 'Known Officer'::text
            END AS complainant_person_type,
          co.is_anonymous,
          co.created_at
          FROM cases_officers co
         WHERE co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND co.deleted_at IS NULL
        UNION ALL
         SELECT ci.case_id,
          i.first_name,
          NULL::character(1) AS middle_name,
          i.last_name,
          NULL::character varying AS suffix,
          'PERSON_IN_CUSTODY'::text AS complainant_person_type,
          ci.is_anonymous,
          ci.created_at
          FROM cases_inmates ci
           JOIN inmates i ON ci.inmate_id::text = i.inmate_id::text
         WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.deleted_at IS NULL
        UNION ALL
         SELECT ci.case_id,
          ci.first_name,
          ci.middle_initial AS middle_name,
          ci.last_name,
          ci.suffix,
          'PERSON_IN_CUSTODY'::text AS complainant_person_type,
          ci.is_anonymous,
          ci.created_at
          FROM cases_inmates ci
         WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.inmate_id IS NULL AND ci.deleted_at IS NULL) c
     WHERE c.created_at = (( SELECT min(cc.created_at) AS created_at
          FROM ( SELECT c_1.case_id,
              c_1.created_at
              FROM civilians c_1
             WHERE c_1.role_on_case = 'Complainant'::enum_civilians_role_on_case AND c_1.deleted_at IS NULL
            UNION ALL
             SELECT co.case_id,
              co.created_at
              FROM cases_officers co
             WHERE co.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND co.deleted_at IS NULL
            UNION ALL
             SELECT ci.case_id,
              ci.created_at
              FROM cases_inmates ci
             WHERE ci.role_on_case = 'Complainant'::enum_cases_officers_role_on_case AND ci.deleted_at IS NULL) cc
         WHERE cc.case_id = c.case_id))) primary_complainant ON cases.id = primary_complainant.case_id
   LEFT JOIN ( SELECT case_tags.case_id,
      case_tags.tag_id
      FROM case_tags) casetags ON cases.id = casetags.case_id
   LEFT JOIN ( SELECT tags.id,
      tags.name
      FROM tags) tagdetails ON tagdetails.id = casetags.tag_id
 GROUP BY cases.id, complaint_type.name, primary_complainant.complainant_first_name, primary_complainant.complainant_middle_name, primary_complainant.complainant_last_name, primary_complainant.complainant_suffix, primary_complainant.complainant_person_type, primary_complainant.complainant_is_anonymous, case_status.name, case_status.order_key;`;

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
