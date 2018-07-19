const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const stringify = require("csv-stringify");
const exportCasesQuery = require("./exportCasesQuery");

const exportCases = asyncMiddleware(async (request, response, next) => {
  await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_CASE_INFORMATION,
        user: request.nickname
      },
      { transaction }
    );

    const caseData = await models.sequelize.query(exportCasesQuery(), {
      type: models.sequelize.QueryTypes.SELECT,
      transaction
    });

    stringify(caseData, csvOptions, (err, csvOutput) => {
      return response.send(csvOutput);
    });
  });
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
  "complainants.civilian_race_ethnicity": "Civilian Complainant Race/Ethnicity",
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

module.exports = exportCases;
