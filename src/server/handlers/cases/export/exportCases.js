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
    "cases.complainant_type, " +
    "cases.narrative_summary, " +
    "cases.narrative_details, " +
    'incidentLocation.street_address AS "incidentLocation.street_address", ' +
    'incidentLocation.intersection AS "incidentLocation.intersection", ' +
    'incidentLocation.city AS "incidentLocation.city", ' +
    'incidentLocation.state AS "incidentLocation.state", ' +
    'incidentLocation.zip_code AS "incidentLocation.zip_code", ' +
    'incidentLocation.street_address2 AS "incidentLocation.street_address2", ' +
    'complainants.full_name as "complainants.full_name", ' +
    'complainants.gender_identity AS "complainants.gender_identity", ' +
    'complainants.race_ethnicity AS "complainants.race_ethnicity", ' +
    `complainants.birth_date AS "complainants.birth_date", ` +
    'complainants.phone_number AS "complainants.phone_number", ' +
    'complainants.email AS "complainants.email", ' +
    'complainants.additional_info AS "complainants.additional_info", ' +
    'complainants.street_address AS "complainants.street_address", ' +
    'complainants.city AS "complainants.city", ' +
    'complainants.state AS "complainants.state", ' +
    'complainants.zip_code AS "complainants.zip_code", ' +
    'complainants.street_address2 AS "complainants.street_address2", ' +
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
    'officerAllegations.details as "officerAllegations.details" ' +
    "FROM cases AS cases " +
    "LEFT OUTER JOIN addresses AS incidentLocation " +
    "ON cases.id = incidentLocation.addressable_id " +
    "AND (" +
    "incidentLocation.deleted_at IS NULL " +
    "AND incidentLocation.addressable_type = 'cases') " +
    "LEFT OUTER JOIN (" +
    " SELECT " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     middle_initial, " +
    "     last_name, " +
    "     suffix) " +
    '     AS "full_name", ' +
    '   case_id AS "case_id", ' +
    '   gender_identity::text AS "gender_identity", ' +
    '   race_ethnicity AS "race_ethnicity", ' +
    `   to_char(birth_date, \'${DATE_ONLY_FORMAT}\') AS "birth_date", ` +
    '   phone_number AS "phone_number", ' +
    '   email AS "email", ' +
    "   additional_info AS additional_info, " +
    "   civilians.created_at, " +
    "   addresses.street_address AS street_address, " +
    "   addresses.city AS city, " +
    "   addresses.state AS state, " +
    "   addresses.zip_code AS zip_code, " +
    "   addresses.street_address2 AS street_address2 " +
    " FROM civilians " +
    " LEFT OUTER JOIN addresses " +
    "   ON addresses.addressable_id = civilians.id " +
    "   AND addresses.addressable_type = 'civilian' " +
    "   AND addresses.deleted_at IS NULL " +
    " WHERE civilians.deleted_at IS NULL " +
    ` AND civilians.role_on_case = \'${COMPLAINANT}\'` +
    " UNION ALL " +
    " SELECT " +
    "   concat_ws(" +
    "     ' ', " +
    "     first_name, " +
    "     middle_name, " +
    "     last_name) " +
    '     AS "full_name", ' +
    '   case_id AS "case_id", ' +
    '   sex AS "gender_identity", ' +
    '   race AS "race_ethnicity", ' +
    `   to_char(dob, \'${DATE_ONLY_FORMAT}\') AS "birth_date", ` +
    "   '' AS \"phone_number\", " +
    "   '' AS \"email\", " +
    "   notes AS additional_info, " +
    "   created_at, " +
    "   '' AS street_address, " +
    "   '' AS city, " +
    "   '' AS state, " +
    "   '' AS zip_code, " +
    "   '' AS street_address2 " +
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
    complainant_type: "Complainant Type",
    "complainants.full_name": "Complainant Name",
    "complainants.gender_identity": "Gender Identity (complainant)",
    "complainants.race_ethnicity": "Race/Ethnicity (complainant)",
    "complainants.birth_date": "Birthday (complainant)",
    "complainants.phone_number": "Phone Number (complainant)",
    "complainants.email": "Email (complainant)",
    "complainants.street_address": "Complainant Address",
    "complainants.city": "Complainant City",
    "complainants.state": "Complainant State",
    "complainants.zip_code": "Complainant Zip Code",
    "complainants.street_address2":
      "Additional Address Information (complainant)",
    "complainants.additional_info": "Notes (complainant)",
    witness_count: "Number of Witnesses",
    witness_names: "Witnesses",
    narrative_summary: "Narrative Summary",
    narrative_details: "Narrative Details",
    "accusedOfficers.full_name": "Accused Officer (Name)",
    "accusedOfficers.windows_username": "Officer Windows Username",
    "accusedOfficers.rank": "Rank/Title",
    "accusedOfficers.supervisor_full_name": "Supervisor Name",
    "accusedOfficers.supervisor_windows_username":
      "Supervisor Windows Username",
    "accusedOfficers.employee_type": "Employee Type",
    "accusedOfficers.district": "District",
    "accusedOfficers.bureau": "Bureau",
    "accusedOfficers.work_status": "Status",
    "accusedOfficers.hire_date": "Hire Date",
    "accusedOfficers.end_date": "End of Employment",
    "accusedOfficers.race": "Race",
    "accusedOfficers.sex": "Sex",
    "accusedOfficers.age": "Age",
    "accusedOfficers.notes": "Notes",
    "allegations.rule": "Allegation Rule",
    "allegations.paragraph": "Allegation Paragraph",
    "allegations.directive": "Allegation Directive",
    "officerAllegations.details": "Allegation Details"
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
