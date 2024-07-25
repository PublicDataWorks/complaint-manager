import _ from "lodash";
import { CASE_EXPORT_TYPE } from "../../../sharedUtilities/constants";

const { COMPLAINANT, WITNESS } = require("../../../sharedUtilities/constants");

const getDateRangeCondition = dateRange => {
  if (dateRange) {
    const postgresDateFormat = `YYYY-MM-DD`;

    const casesField = _.snakeCase(dateRange.type);

    return `AND cases.${casesField} BETWEEN to_date('${dateRange.exportStartDate}', '${postgresDateFormat}') and to_date('${dateRange.exportEndDate}', '${postgresDateFormat}')`;
  } else {
    return "";
  }
};

const getOrderByClauseForCases = dateRange => {
  let orderByClauseForCases = "";
  if (dateRange && dateRange.type === CASE_EXPORT_TYPE.FIRST_CONTACT_DATE) {
    orderByClauseForCases = "cases.first_contact_date ASC, ";
  } else if (dateRange && dateRange.type === CASE_EXPORT_TYPE.INCIDENT_DATE) {
    orderByClauseForCases = "cases.incident_date ASC, ";
  } else {
    orderByClauseForCases = "cases.year ASC, cases.case_number ASC, ";
  }
  return orderByClauseForCases;
};

const exportCasesQuery = (dateRange = null) => {
  const DATE_ONLY_FORMAT = "MM/DD/YYYY";
  const TIME_ONLY_FORMAT = "HH24:MI:SS";
  const FILE_EXTENSION_PATTERN = "([^.]+)$";

  const query =
    "SELECT " +
    "cases.id, " +
    "cases.year, " +
    "cases.case_number, " +
    "status.name AS status, " +
    "cases.created_by, " +
    "cases.pib_case_number, " +
    "concat_ws(" +
    " ' ', " +
    "cases.created_at" +
    ") AS created_at, " +
    `to_char(cases.first_contact_date, \'${DATE_ONLY_FORMAT}\') AS first_contact_date, ` +
    `to_char(cases.incident_date, \'${DATE_ONLY_FORMAT}\') AS incident_date, ` +
    `to_char(cases.incident_time, \'${TIME_ONLY_FORMAT}\') AS incident_time, ` +
    "cases.complaint_type, " +
    "cases.narrative_summary, " +
    "REGEXP_REPLACE(cases.narrative_details, '<[^>]*>', '', 'g') AS narrative_details," +
    "classifications.name as classifications, " +
    "intake_sources.name AS intake_source, " +
    "how_did_you_hear_about_us_sources.name AS how_did_you_hear_about_us_source, " +
    "districts.name AS district, " +
    `(SELECT COUNT(*) FROM cases_officers WHERE role_on_case='${WITNESS}' AND case_id=cases.id AND deleted_at IS NULL) +` +
    `(SELECT COUNT(*) FROM civilians WHERE role_on_case='${WITNESS}' AND case_id=cases.id AND deleted_at IS NULL) AS witness_count, ` +
    `incidentLocation.street_address AS "incidentLocation.street_address", ` +
    `incidentLocation.intersection AS "incidentLocation.intersection", ` +
    'incidentLocation.city AS "incidentLocation.city", ' +
    'incidentLocation.state AS "incidentLocation.state", ' +
    'incidentLocation.zip_code AS "incidentLocation.zip_code", ' +
    'incidentLocation.lat AS "incidentLocation.lat", ' +
    'incidentLocation.lng AS "incidentLocation.lng", ' +
    'incidentLocation.street_address2 AS "incidentLocation.street_address2", ' +
    'default_person_type.abbreviation AS "default_abbreviation", ' +
    `CASE WHEN complainants.complainant IS NULL THEN 'Civilian' ` +
    "     ELSE complainants.complainant " +
    'END AS "complainants.complainant", ' +
    'complainants.abbreviation AS "complainants.abbreviation", ' +
    'complainants.isAnonymous AS "complainants.isAnonymous", ' +
    'complainants.civilian_full_name as "complainants.civilian_full_name", ' +
    'complainants.civilian_gender_identity AS "complainants.civilian_gender_identity", ' +
    'complainants.civilian_race_ethnicity AS "complainants.civilian_race_ethnicity", ' +
    `CASE WHEN complainants.civilian_dob IS NULL OR cases.incident_date IS NULL THEN 'N/A' ` +
    `     ELSE trim(to_char(date_part('year', age(cases.incident_date, complainants.civilian_dob)), '999')) ` +
    `END ` +
    `AS "complainants.civilian_age", ` +
    'complainants.civilian_phone_number AS "complainants.civilian_phone_number", ' +
    'complainants.civilian_email AS "complainants.civilian_email", ' +
    'complainants.civilian_additional_info AS "complainants.civilian_additional_info", ' +
    'complainants.civilian_street_address AS "complainants.civilian_street_address", ' +
    'complainants.civilian_city AS "complainants.civilian_city", ' +
    'complainants.civilian_state AS "complainants.civilian_state", ' +
    'complainants.civilian_zip_code AS "complainants.civilian_zip_code", ' +
    'complainants.civilian_lat AS "complainants.civilian_lat", ' +
    'complainants.civilian_lng AS "complainants.civilian_lng", ' +
    'complainants.civilian_street_address2 AS "complainants.civilian_street_address2", ' +
    'complainants.officer_id AS "complainants.officer_id", ' +
    "complainants.officer_full_name, " +
    " CASE WHEN complainants.officer_full_name='' THEN 'Unknown Officer'" +
    "   ELSE complainants.officer_full_name" +
    " END " +
    'AS "complainants.officer_full_name", ' +
    'complainants.officer_employee_id AS "complainants.officer_employee_id", ' +
    'complainants.officer_rank AS "complainants.officer_rank", ' +
    'complainants.officer_supervisor_full_name AS "complainants.officer_supervisor_full_name", ' +
    'complainants.officer_supervisor_employee_id AS "complainants.officer_supervisor_employee_id", ' +
    'complainants.officer_employee_type AS "complainants.officer_employee_type", ' +
    'complainants.officer_district AS "complainants.officer_district", ' +
    'complainants.officer_bureau AS "complainants.officer_bureau", ' +
    'complainants.officer_work_status AS "complainants.officer_work_status", ' +
    `to_char(complainants.officer_hire_date, \'${DATE_ONLY_FORMAT}\') AS "complainants.officer_hire_date", ` +
    `to_char(complainants.officer_end_date, \'${DATE_ONLY_FORMAT}\') AS "complainants.officer_end_date", ` +
    'complainants.officer_race AS "complainants.officer_race", ' +
    'complainants.officer_sex AS "complainants.officer_sex", ' +
    `CASE WHEN complainants.officer_dob IS NULL OR cases.incident_date IS NULL THEN 'N/A' ` +
    `     ELSE trim(to_char(date_part('year',age(cases.incident_date, complainants.officer_dob)), '999')) ` +
    `END ` +
    ` AS "complainants.officer_age", ` +
    'complainants.officer_notes AS "complainants.officer_notes", ' +
    'accusedOfficers.id AS "accusedOfficers.id", ' +
    "concat_ws(" +
    " ' ', " +
    " accusedOfficers.first_name, " +
    " NULLIF(accusedOfficers.middle_name, ''), " +
    " accusedOfficers.last_name" +
    ")," +
    "   CASE WHEN concat_ws(" +
    "             ' ', " +
    "             accusedOfficers.first_name, " +
    "             NULLIF(accusedOfficers.middle_name, ''), " +
    "             accusedOfficers.last_name)='' THEN 'Unknown Officer' " +
    "   ELSE  concat_ws(" +
    "         ' ', " +
    "         accusedOfficers.first_name, " +
    "         NULLIF(accusedOfficers.middle_name, ''), " +
    "         accusedOfficers.last_name) " +
    "   END" +
    ' AS "accusedOfficers.full_name", ' +
    'accusedOfficers.employee_id AS "accusedOfficers.employee_id", ' +
    'accusedOfficers.rank AS "accusedOfficers.rank", ' +
    "concat_ws(" +
    " ' ', " +
    " accusedOfficers.supervisor_first_name, " +
    " NULLIF(accusedOfficers.supervisor_middle_name, ''), " +
    " accusedOfficers.supervisor_last_name" +
    ') AS "accusedOfficers.supervisor_full_name", ' +
    'accusedOfficers.supervisor_employee_id AS "accusedOfficers.supervisor_employee_id", ' +
    'accusedOfficers.employee_type AS "accusedOfficers.employee_type", ' +
    'accusedOfficers.district AS "accusedOfficers.district", ' +
    'accusedOfficers.bureau AS "accusedOfficers.bureau", ' +
    'accusedOfficers.work_status AS "accusedOfficers.work_status", ' +
    `to_char(accusedOfficers.hire_date, \'${DATE_ONLY_FORMAT}\') AS "accusedOfficers.hire_date", ` +
    `to_char(accusedOfficers.end_date, \'${DATE_ONLY_FORMAT}\') AS "accusedOfficers.end_date", ` +
    'accusedOfficers.race AS "accusedOfficers.race", ' +
    'accusedOfficers.sex AS "accusedOfficers.sex", ' +
    `CASE WHEN accusedOfficers.dob IS NULL OR cases.incident_date IS NULL THEN 'N/A' ` +
    `     ELSE trim(to_char(date_part('year', age(cases.incident_date, accusedOfficers.dob)), '999')) ` +
    `END ` +
    ' AS "accusedOfficers.age", ' +
    'accusedOfficers.notes AS "accusedOfficers.notes", ' +
    'allegations.rule as "allegations.rule", ' +
    'allegations.paragraph as "allegations.paragraph", ' +
    'allegations.directive as "allegations.directive", ' +
    'officerAllegations.details as "officerAllegations.details", ' +
    'officerAllegations.severity as "officerAllegations.severity", ' +
    'attachments.attachment_types as "attachments.attachment_types" ' +
    "FROM cases AS cases " +
    "LEFT OUTER JOIN case_statuses status ON cases.status = status.id " +
    "LEFT OUTER JOIN case_classifications ON case_classifications.case_id = cases.id " +
    "LEFT OUTER JOIN classifications ON classifications.id = case_classifications.classification_id " +
    "LEFT OUTER JOIN intake_sources " +
    " ON cases.intake_source_id = intake_sources.id " +
    "LEFT OUTER JOIN how_did_you_hear_about_us_sources " +
    " ON cases.how_did_you_hear_about_us_source_id = how_did_you_hear_about_us_sources.id " +
    "LEFT OUTER JOIN districts " +
    " ON cases.district_id = districts.id " +
    "LEFT OUTER JOIN addresses AS incidentLocation " +
    " ON cases.id = incidentLocation.addressable_id " +
    " AND incidentLocation.deleted_at IS NULL " +
    " AND incidentLocation.addressable_type = 'cases' " +
    "LEFT OUTER JOIN person_types default_person_type ON default_person_type.is_default = true " +
    "LEFT OUTER JOIN (" +
    " SELECT " +
    '   case_id AS "case_id", ' +
    "   civilians.created_at, " +
    "   person_type_details.description AS complainant, " +
    "   person_type_details.abbreviation AS abbreviation, " +
    "   civilians.is_anonymous AS isAnonymous, " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     NULLIF(middle_initial, ''), " +
    "     last_name, " +
    "     suffix)" +
    '     AS "civilian_full_name", ' +
    '   gender_identities.name AS "civilian_gender_identity", ' +
    '   race_ethnicities.name AS "civilian_race_ethnicity", ' +
    "   birth_date AS civilian_dob, " +
    `   CASE WHEN phone_number = '' OR phone_number IS NULL ` +
    `     THEN ''` +
    `     ELSE '(' || (SUBSTRING(phone_number from 1 for 3) || ') ' || SUBSTRING(phone_number from 4 for 3) || '-' || SUBSTRING(phone_number from 7 for 4)) ` +
    `     END ` +
    `     AS "civilian_phone_number", ` +
    '   email AS "civilian_email", ' +
    "   additional_info AS civilian_additional_info, " +
    "   addresses.street_address AS civilian_street_address, " +
    "   addresses.city AS civilian_city, " +
    "   addresses.state AS civilian_state, " +
    "   addresses.zip_code AS civilian_zip_code, " +
    "   addresses.lat AS civilian_lat, " +
    "   addresses.lng AS civilian_lng, " +
    "   addresses.street_address2 AS civilian_street_address2, " +
    '   NULL AS "officer_id", ' +
    '   NULL AS "officer_full_name", ' +
    "   NULL AS officer_employee_id, " +
    "   NULL AS officer_rank, " +
    "   NULL AS officer_supervisor_full_name, " +
    "   NULL AS officer_supervisor_employee_id, " +
    "   NULL AS officer_employee_type, " +
    "   NULL AS officer_district, " +
    "   NULL AS officer_bureau, " +
    "   NULL AS officer_work_status, " +
    "   NULL AS officer_hire_date, " +
    "   NULL AS officer_end_date, " +
    "   NULL AS officer_race, " +
    "   NULL AS officer_sex, " +
    `   NULL AS officer_dob, ` +
    "   NULL AS officer_notes " +
    " FROM civilians " +
    " LEFT OUTER JOIN addresses " +
    "   ON addresses.addressable_id = civilians.id " +
    "   AND addresses.addressable_type = 'civilian' " +
    "   AND addresses.deleted_at IS NULL " +
    " LEFT OUTER JOIN race_ethnicities " +
    " ON race_ethnicities.id = civilians.race_ethnicity_id" +
    " LEFT OUTER JOIN gender_identities " +
    " ON gender_identities.id = civilians.gender_identity_id" +
    " LEFT OUTER JOIN person_types person_type_details ON person_type_details.key = civilians.person_type" +
    " WHERE civilians.deleted_at IS NULL " +
    ` AND civilians.role_on_case = \'${COMPLAINANT}\'` +
    " UNION ALL " +
    " SELECT " +
    '   case_id AS "case_id", ' +
    "   cases_officers.created_at, " +
    "   person_type_details.employee_description AS complainant, " +
    "   person_type_details.abbreviation AS abbreviation, " +
    "   is_anonymous AS isAnonymous, " +
    '   NULL AS "civilian_full_name", ' +
    '   NULL AS "civilian_gender_identity", ' +
    '   NULL AS "civilian_race_ethnicity", ' +
    `   NULL AS "civilian_dob", ` +
    '   NULL AS "civilian_phone_number", ' +
    '   NULL AS "civilian_email", ' +
    "   NULL AS civilian_additional_info, " +
    "   NULL AS civilian_street_address, " +
    "   NULL AS civilian_city, " +
    "   NULL AS civilian_state, " +
    "   NULL AS civilian_zip_code, " +
    "   NULL AS civilian_lat, " +
    "   NULL AS civilian_lng, " +
    "   NULL AS civilian_street_address2, " +
    "   id AS officer_id, " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     NULLIF(middle_name, ''), " +
    "     last_name) " +
    '     AS "officer_full_name", ' +
    "   employee_id AS officer_employee_id, " +
    "   rank AS officer_rank, " +
    "   concat_ws(' ', " +
    "     supervisor_first_name, " +
    "     NULLIF(supervisor_middle_name, ''), " +
    "     supervisor_last_name" +
    "   ) AS officer_supervisor_full_name, " +
    "   supervisor_employee_id AS officer_supervisor_employee_id, " +
    "   employee_type AS officer_employee_type, " +
    "   district AS district, " +
    "   bureau AS officer_bureau, " +
    "   work_status AS officer_work_status, " +
    "   hire_date AS officer_hire_date, " +
    "   end_date AS officer_end_date, " +
    '   race AS "officer_race", ' +
    '   sex AS "officer_sex", ' +
    "   dob AS officer_dob, " +
    "   notes AS officer_notes " +
    " FROM cases_officers " +
    " LEFT OUTER JOIN person_types person_type_details ON person_type_details.key = cases_officers.person_type" +
    " WHERE deleted_at IS NULL " +
    ` AND role_on_case = \'${COMPLAINANT}\'` +
    ") AS complainants ON cases.id = complainants.case_id " +
    "LEFT OUTER JOIN cases_officers AS accusedOfficers " +
    " ON cases.id = accusedOfficers.case_id " +
    " AND accusedOfficers.deleted_at IS NULL " +
    " AND accusedOfficers.role_on_case = 'Accused' " +
    "LEFT OUTER JOIN officers_allegations as officerAllegations " +
    " ON accusedOfficers.id = officerAllegations.case_officer_id " +
    " AND officerAllegations.deleted_at IS NULL " +
    "LEFT OUTER JOIN allegations " +
    " ON officerAllegations.allegation_id = allegations.id " +
    "LEFT OUTER JOIN ( " +
    ` SELECT case_id, string_agg(substring(file_name from '${FILE_EXTENSION_PATTERN}'), ', ') as attachment_types` +
    " FROM attachments " +
    " GROUP BY case_id" +
    ") as attachments " +
    " ON attachments.case_id = cases.id " +
    "where cases.deleted_at IS NULL " +
    "and case_classifications.deleted_at IS NULL " +
    getDateRangeCondition(dateRange) +
    "ORDER BY " +
    getOrderByClauseForCases(dateRange) +
    "complainants.created_at ASC, accusedOfficers.created_at ASC, officerAllegations.created_at ASC;";
  return query;
};

module.exports = exportCasesQuery;
