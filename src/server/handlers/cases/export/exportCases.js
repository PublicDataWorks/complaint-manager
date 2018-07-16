const {
  COMPLAINANT,
  TIMEZONE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const stringify = require("csv-stringify");

const exportCases = asyncMiddleware(async (request, response, next) => {
  const DATE_ONLY_FORMAT = "MM/DD/YYYY";
  const TIMESTAMP_FORMAT = "MM/DD/YYYY HH24:MI:SS TZ";
  const TIME_ONLY_FORMAT = "HH24:MI:SS";
  const FILE_EXTENSION_PATTERN = "([^.]+)$";

  const query =
    "SELECT " +
    "cases.id, " +
    "cases.status, " +
    "cases.created_by, " +
    `to_char(cases.created_at at time zone \'${TIMEZONE}\', \'${TIMESTAMP_FORMAT}\') AS created_at, ` +
    `to_char(cases.first_contact_date, \'${DATE_ONLY_FORMAT}\') AS first_contact_date, ` +
    `to_char(cases.incident_date, \'${DATE_ONLY_FORMAT}\') AS incident_date, ` +
    `to_char(cases.incident_time, \'${TIME_ONLY_FORMAT}\') AS incident_time, ` +
    "cases.district, " +
    "cases.complaint_type, " +
    "cases.narrative_summary, " +
    "cases.narrative_details, " +
    'incidentLocation.street_address AS "incidentLocation.street_address", ' +
    'incidentLocation.intersection AS "incidentLocation.intersection", ' +
    'incidentLocation.city AS "incidentLocation.city", ' +
    'incidentLocation.state AS "incidentLocation.state", ' +
    'incidentLocation.zip_code AS "incidentLocation.zip_code", ' +
    'incidentLocation.street_address2 AS "incidentLocation.street_address2", ' +
    'complainants.complainant AS "complainants.complainant",' +
    'complainants.civilian_full_name as "complainants.civilian_full_name", ' +
    'complainants.civilian_gender_identity AS "complainants.civilian_gender_identity", ' +
    'complainants.civilian_race_ethnicity AS "complainants.civilian_race_ethnicity", ' +
    `complainants.civilian_age AS "complainants.civilian_age", ` +
    'complainants.civilian_phone_number AS "complainants.civilian_phone_number", ' +
    'complainants.civilian_email AS "complainants.civilian_email", ' +
    'complainants.civilian_additional_info AS "complainants.civilian_additional_info", ' +
    'complainants.civilian_street_address AS "complainants.civilian_street_address", ' +
    'complainants.civilian_city AS "complainants.civilian_city", ' +
    'complainants.civilian_state AS "complainants.civilian_state", ' +
    'complainants.civilian_zip_code AS "complainants.civilian_zip_code", ' +
    'complainants.civilian_street_address2 AS "complainants.civilian_street_address2", ' +
    'complainants.officer_full_name AS "complainants.officer_full_name", ' +
    'complainants.officer_windows_username AS "complainants.officer_windows_username", ' +
    'complainants.officer_rank AS "complainants.officer_rank", ' +
    'complainants.officer_supervisor_full_name AS "complainants.officer_supervisor_full_name", ' +
    'complainants.officer_supervisor_windows_username AS "complainants.officer_supervisor_windows_username", ' +
    'complainants.officer_employee_type AS "complainants.officer_employee_type", ' +
    'complainants.officer_district AS "complainants.officer_district", ' +
    'complainants.officer_bureau AS "complainants.officer_bureau", ' +
    'complainants.officer_work_status AS "complainants.officer_work_status", ' +
    `to_char(complainants.officer_hire_date, \'${DATE_ONLY_FORMAT}\') AS "complainants.officer_hire_date", ` +
    `to_char(complainants.officer_end_date, \'${DATE_ONLY_FORMAT}\') AS "complainants.officer_end_date", ` +
    'complainants.officer_race AS "complainants.officer_race", ' +
    'complainants.officer_sex AS "complainants.officer_sex", ' +
    'complainants.officer_age AS "complainants.officer_age", ' +
    'complainants.officer_notes AS "complainants.officer_notes", ' +
    "concat_ws(" +
    "' ', " +
    "accusedOfficers.first_name, " +
    "accusedOfficers.middle_name, " +
    "accusedOfficers.last_name" +
    ') AS "accusedOfficers.full_name", ' +
    'accusedOfficers.windows_username AS "accusedOfficers.windows_username", ' +
    'accusedOfficers.rank AS "accusedOfficers.rank", ' +
    "concat_ws(" +
    "' ', " +
    "accusedOfficers.supervisor_first_name, " +
    "accusedOfficers.supervisor_middle_name, " +
    "accusedOfficers.supervisor_last_name" +
    ') AS "accusedOfficers.supervisor_full_name", ' +
    'accusedOfficers.supervisor_windows_username AS "accusedOfficers.supervisor_windows_username", ' +
    'accusedOfficers.employee_type AS "accusedOfficers.employee_type", ' +
    'accusedOfficers.district AS "accusedOfficers.district", ' +
    'accusedOfficers.bureau AS "accusedOfficers.bureau", ' +
    'accusedOfficers.work_status AS "accusedOfficers.work_status", ' +
    `to_char(accusedOfficers.hire_date, \'${DATE_ONLY_FORMAT}\') AS "accusedOfficers.hire_date", ` +
    `to_char(accusedOfficers.end_date, \'${DATE_ONLY_FORMAT}\') AS "accusedOfficers.end_date", ` +
    'accusedOfficers.race AS "accusedOfficers.race", ' +
    'accusedOfficers.sex AS "accusedOfficers.sex", ' +
    "date_part('year', age(accusedOfficers.dob)) AS \"accusedOfficers.age\", " +
    'accusedOfficers.notes AS "accusedOfficers.notes", ' +
    'allegations.rule as "allegations.rule", ' +
    'allegations.paragraph as "allegations.paragraph", ' +
    'allegations.directive as "allegations.directive", ' +
    'officerAllegations.details as "officerAllegations.details", ' +
    'attachments.attachment_types as "attachments.attachment_types" ' +
    "FROM cases AS cases " +
    "LEFT OUTER JOIN addresses AS incidentLocation " +
    "ON cases.id = incidentLocation.addressable_id " +
    "AND (" +
    "incidentLocation.deleted_at IS NULL " +
    "AND incidentLocation.addressable_type = 'cases') " +
    "LEFT OUTER JOIN (" +
    " SELECT " +
    '   case_id AS "case_id", ' +
    "   civilians.created_at, " +
    "   'Civilian' AS complainant, " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     middle_initial, " +
    "     last_name, " +
    "     suffix) " +
    '     AS "civilian_full_name", ' +
    '   gender_identity AS "civilian_gender_identity", ' +
    '   race_ethnicity AS "civilian_race_ethnicity", ' +
    "   date_part('year', age(birth_date)) AS civilian_age, " +
    '   phone_number AS "civilian_phone_number", ' +
    '   email AS "civilian_email", ' +
    "   additional_info AS civilian_additional_info, " +
    "   addresses.street_address AS civilian_street_address, " +
    "   addresses.city AS civilian_city, " +
    "   addresses.state AS civilian_state, " +
    "   addresses.zip_code AS civilian_zip_code, " +
    "   addresses.street_address2 AS civilian_street_address2, " +
    '   NULL AS "officer_full_name", ' +
    "   NULL AS officer_windows_username, " +
    "   NULL AS officer_rank, " +
    "   NULL AS officer_supervisor_full_name, " +
    "   NULL AS officer_supervisor_windows_username, " +
    "   NULL AS officer_employee_type, " +
    "   NULL AS officer_district, " +
    "   NULL AS officer_bureau, " +
    "   NULL AS officer_work_status, " +
    "   NULL AS officer_hire_date, " +
    "   NULL AS officer_end_date, " +
    "   NULL AS officer_race, " +
    "   NULL AS officer_sex, " +
    `   NULL AS officer_age, ` +
    "   NULL AS officer_notes " +
    " FROM civilians " +
    " LEFT OUTER JOIN addresses " +
    "   ON addresses.addressable_id = civilians.id " +
    "   AND addresses.addressable_type = 'civilian' " +
    "   AND addresses.deleted_at IS NULL " +
    " WHERE civilians.deleted_at IS NULL " +
    ` AND civilians.role_on_case = \'${COMPLAINANT}\'` +
    " UNION ALL " +
    " SELECT " +
    '   case_id AS "case_id", ' +
    "   created_at, " +
    "   'Officer' AS complainant, " +
    '   NULL  AS "civilian_full_name", ' +
    '   NULL AS "civilian_gender_identity", ' +
    '   NULL AS "civilian_race_ethnicity", ' +
    `   NULL AS "civilian_age", ` +
    '   NULL AS "civilian_phone_number", ' +
    '   NULL AS "civilian_email", ' +
    "   NULL AS civilian_additional_info, " +
    "   NULL AS civilian_street_address, " +
    "   NULL AS civilian_city, " +
    "   NULL AS civilian_state, " +
    "   NULL AS civilian_zip_code, " +
    "   NULL AS civilian_street_address2, " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     middle_name, " +
    "     last_name) " +
    '     AS "officer_full_name", ' +
    "   windows_username AS officer_windows_username, " +
    "   rank AS officer_rank, " +
    "   concat_ws(' ', " +
    "     supervisor_first_name, " +
    "     supervisor_middle_name, " +
    "     supervisor_last_name" +
    "   ) AS officer_supervisor_full_name, " +
    "   supervisor_windows_username AS officer_supervisor_windows_username, " +
    "   employee_type AS officer_employee_type, " +
    "   district AS officer_district, " +
    "   bureau AS officer_bureau, " +
    "   work_status AS officer_work_status, " +
    "   hire_date AS officer_hire_date, " +
    "   end_date AS officer_end_date, " +
    '   race AS "officer_race", ' +
    '   sex AS "officer_sex", ' +
    "   date_part('year', age(dob)) AS officer_age, " +
    "   notes AS officer_notes " +
    " FROM cases_officers " +
    " WHERE deleted_at IS NULL " +
    ` AND role_on_case = \'${COMPLAINANT}\'` +
    ") AS complainants ON cases.id = complainants.case_id " +
    "LEFT OUTER JOIN cases_officers AS accusedOfficers " +
    "ON cases.id = accusedOfficers.case_id " +
    "AND (" +
    "accusedOfficers.deleted_at IS NULL " +
    "AND accusedOfficers.role_on_case = 'Accused') " +
    "LEFT OUTER JOIN officers_allegations as officerAllegations " +
    "ON accusedOfficers.id = officerAllegations.case_officer_id " +
    "AND officerAllegations.deleted_at IS NULL " +
    "LEFT OUTER JOIN allegations " +
    "ON officerAllegations.allegation_id = allegations.id " +
    "LEFT OUTER JOIN ( " +
    ` SELECT case_id, string_agg(substring(file_name from '${FILE_EXTENSION_PATTERN}'), ', ') as attachment_types` +
    " FROM attachments " +
    " GROUP BY case_id" +
    ") as attachments " +
    "ON attachments.case_id = cases.id " +
    "ORDER BY cases.created_at ASC, complainants.created_at ASC, accusedOfficers.created_at ASC, officerAllegations.created_at ASC;";

  const caseData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT
  });

  const columns = {
    id: "Case #",
    status: "Case Status",
    created_by: "Created by",
    created_at: "Created on",
    first_contact_date: "First Contact Date",
    incident_date: "Incident Date",
    incident_time: "Incident Time",
    "incidentLocation.street_address": "Incident Address",
    "incidentLocation.intersection": "Incident Intersection",
    "incidentLocation.city": "Incident City",
    "incidentLocation.state": "Incident State",
    "incidentLocation.zip_code": "Incident Zip Code",
    district: "Incident District",
    "incidentLocation.street_address2": "Additional Incident Location Info",
    complaint_type: "Complaint Type",
    "complainants.complainant": "Complainant",
    "complainants.civilian_full_name": "Civilian Complainant Name",
    "complainants.civilian_gender_identity":
      "Civilian Complainant Gender Identity",
    "complainants.civilian_race_ethnicity":
      "Civilian Complainant Race/Ethnicity",
    "complainants.civilian_age": "Civilian Complainant Age",
    "complainants.civilian_phone_number": "Civilian Complainant Phone Number",
    "complainants.civilian_email": "Civilian Complainant Email",
    "complainants.civilian_street_address": "Civilian Complainant Address",
    "complainants.civilian_city": "Civilian Complainant City",
    "complainants.civilian_state": "Civilian Complainant State",
    "complainants.civilian_zip_code": "Civilian Complainant Zip Code",
    "complainants.civilian_street_address2":
      "Civilian Complainant Additional Address Information",
    "complainants.civilian_additional_info": "Civilian Complainant Notes",
    "complainants.officer_full_name": "Officer Complainant Name",
    "complainants.officer_windows_username":
      "Officer Complainant Windows Username",
    "complainants.officer_rank": "Officer Complainant Rank/Title",
    "complainants.officer_supervisor_full_name":
      "Officer Complainant Supervisor Name",
    "complainants.officer_supervisor_windows_username":
      "Officer Complainant Supervisor Windows Username",
    "complainants.officer_employee_type": "Officer Complainant Employee Type",
    "complainants.officer_district": "Officer Complainant District",
    "complainants.officer_bureau": "Officer Complainant Bureau",
    "complainants.officer_work_status": "Officer Complainant Status",
    "complainants.officer_hire_date": "Officer Complainant Hire Date",
    "complainants.officer_end_date": "Officer Complainant End of Employment",
    "complainants.officer_race": "Officer Complainant Race",
    "complainants.officer_sex": "Officer Complainant Sex",
    "complainants.officer_age": "Officer Complainant Age",
    "complainants.officer_notes": "Officer Complainant Notes",
    witness_count: "Number of Witnesses",
    witness_names: "Witnesses",
    narrative_summary: "Narrative Summary",
    narrative_details: "Narrative Details",
    "accusedOfficers.full_name": "Accused Officer Name",
    "accusedOfficers.windows_username": "Accused Officer Windows Username",
    "accusedOfficers.rank": "Accused Officer Rank/Title",
    "accusedOfficers.supervisor_full_name": "Accused Officer Supervisor Name",
    "accusedOfficers.supervisor_windows_username":
      "Accused Officer Supervisor Windows Username",
    "accusedOfficers.employee_type": "Accused Officer Employee Type",
    "accusedOfficers.district": "Accused Officer District",
    "accusedOfficers.bureau": "Accused Officer Bureau",
    "accusedOfficers.work_status": "Accused Officer Status",
    "accusedOfficers.hire_date": "Accused Officer Hire Date",
    "accusedOfficers.end_date": "Accused Officer End of Employment",
    "accusedOfficers.race": "Accused Officer Race",
    "accusedOfficers.sex": "Accused Officer Sex",
    "accusedOfficers.age": "Accused Officer Age",
    "accusedOfficers.notes": "Accused Officer Notes",
    "allegations.rule": "Allegation Rule",
    "allegations.paragraph": "Allegation Paragraph",
    "allegations.directive": "Allegation Directive",
    "officerAllegations.details": "Allegation Details",
    "attachments.attachment_types": "Types of Attachments"
  };

  const csvOptions = {
    header: true,
    columns: columns
  };
  stringify(caseData, csvOptions, (err, csvOutput) => {
    return response.send(csvOutput);
  });
});

module.exports = exportCases;
