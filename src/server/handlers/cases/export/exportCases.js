const { TIMEZONE } = require("../../../../sharedUtilities/constants");
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
    'incidentLocation.city AS "incidentLocation.city", ' +
    'incidentLocation.state AS "incidentLocation.state", ' +
    'incidentLocation.zip_code AS "incidentLocation.zip_code", ' +
    'incidentLocation.street_address2 AS "incidentLocation.street_address2", ' +
    "concat_ws(" +
    "' ', " +
    "complainantCivilians.first_name, " +
    "complainantCivilians.middle_initial, " +
    "complainantCivilians.last_name, " +
    "complainantCivilians.suffix) " +
    'AS "complainantCivilians.full_name", ' +
    'complainantCivilians.gender_identity AS "complainantCivilians.gender_identity", ' +
    'complainantCivilians.race_ethnicity AS "complainantCivilians.race_ethnicity", ' +
    `to_char(complainantCivilians.birth_date, \'${DATE_ONLY_FORMAT}\') AS "complainantCivilians.birth_date", ` +
    'complainantCivilians.phone_number AS "complainantCivilians.phone_number", ' +
    'complainantCivilians.email AS "complainantCivilians.email", ' +
    'complainantCivilians.additional_info AS "complainantCivilians.additional_info", ' +
    '"complainantCivilians->address".id AS "complainantCivilians.address.id", ' +
    '"complainantCivilians->address".street_address AS "complainantCivilians.address.street_address", ' +
    '"complainantCivilians->address".city AS "complainantCivilians.address.city", ' +
    '"complainantCivilians->address".state AS "complainantCivilians.address.state", ' +
    '"complainantCivilians->address".zip_code AS "complainantCivilians.address.zip_code", ' +
    '"complainantCivilians->address".street_address2 AS "complainantCivilians.address.street_address2", ' +
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
    "LEFT OUTER JOIN civilians AS complainantCivilians " +
    "ON cases.id = complainantCivilians.case_id " +
    "AND (" +
    "complainantCivilians.deleted_at IS NULL " +
    "AND complainantCivilians.role_on_case = 'Complainant') " +
    'LEFT OUTER JOIN addresses AS "complainantCivilians->address" ' +
    'ON complainantCivilians.id = "complainantCivilians->address".addressable_id ' +
    "AND (" +
    '"complainantCivilians->address".deleted_at IS NULL ' +
    "AND \"complainantCivilians->address\".addressable_type = 'civilian') " +
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
    "ORDER BY cases.created_at ASC, complainantCivilians.created_at ASC, accusedOfficers.created_at ASC, officerAllegations.created_at ASC;";

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
    "incidentLocation.city": "Incident City",
    "incidentLocation.state": "Incident State",
    "incidentLocation.zip_code": "Incident Zip Code",
    district: "Incident District",
    "incidentLocation.street_address2": "Additional Incident Location Info",
    complainant_type: "Complainant Type",
    "complainantCivilians.full_name": "Complainant Name",
    "complainantCivilians.gender_identity": "Gender Identity (complainant)",
    "complainantCivilians.race_ethnicity": "Race/Ethnicity (complainant)",
    "complainantCivilians.birth_date": "Birthday (complainant)",
    "complainantCivilians.phone_number": "Phone Number (complainant)",
    "complainantCivilians.email": "Email (complainant)",
    "complainantCivilians.address.street_address": "Complainant Address",
    "complainantCivilians.address.city": "Complainant City",
    "complainantCivilians.address.state": "Complainant State",
    "complainantCivilians.address.zip_code": "Complainant Zip Code",
    "complainantCivilians.address.street_address2":
      "Additional Address Information (complainant)",
    "complainantCivilians.additional_info": "Notes (complainant)",
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
