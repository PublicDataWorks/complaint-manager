const { TIMEZONE } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const stringify = require("csv-stringify");

const exportCases = asyncMiddleware(async (request, response, next) => {
  const attributesWithAliases = [
    "id",
    "status",
    "created_by",
    [
      models.sequelize.fn(
        "to_char",
        models.sequelize.literal(`cases.created_at at time zone '${TIMEZONE}'`),
        "MM/DD/YYYY HH24:MI:SS TZ"
      ),
      "created_at"
    ],
    [
      models.sequelize.fn(
        "to_char",
        models.sequelize.col("cases.first_contact_date"),
        "MM/DD/YYYY"
      ),
      "first_contact_date"
    ],
    [
      models.sequelize.fn(
        "to_char",
        models.sequelize.col("cases.incident_date"),
        "MM/DD/YYYY"
      ),
      "incident_date"
    ],
    [
      models.sequelize.fn(
        "to_char",
        models.sequelize.col("cases.incident_time"),
        "HH24:MI:SS"
      ),
      "incident_time"
    ],
    "district",
    "complainant_type",
    "narrative_summary",
    "narrative_details"
    // [
    //   models.sequelize.literal(
    //     '(SELECT COUNT("witnessCivilians1".*) ' +
    //       'FROM "civilians" AS "witnessCivilians1" ' +
    //       'WHERE "witnessCivilians1"."role_on_case" = \'Witness\'' +
    //       'AND "cases1"."id" = "witnessCivilians1"."case_id")'
    //   ),
    //   "witnessCount"
    // ]
  ];

  const cases = await models.cases.findAll({
    attributes: attributesWithAliases,
    raw: true,
    order: [
      [models.sequelize.col("cases.created_at"), "ASC"],
      [models.sequelize.col("complainantCivilians.created_at"), "ASC"],
      [models.sequelize.col("accusedOfficers.created_at"), "ASC"]
    ],
    include: [
      {
        model: models.address,
        as: "incidentLocation",
        attributes: [
          "street_address",
          "city",
          "state",
          "zip_code",
          "street_address2"
        ]
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        attributes: [
          [
            models.sequelize.fn(
              "concat_ws",
              " ",
              models.sequelize.col("complainantCivilians.first_name"),
              models.sequelize.col("complainantCivilians.middle_initial"),
              models.sequelize.col("complainantCivilians.last_name"),
              models.sequelize.col("complainantCivilians.suffix")
            ),
            "full_name"
          ],
          "gender_identity",
          "race_ethnicity",
          [
            models.sequelize.fn(
              "to_char",
              models.sequelize.col("complainantCivilians.birth_date"),
              "MM/DD/YYYY"
            ),
            "birth_date"
          ],
          "phone_number",
          "email",
          "additional_info"
        ],
        include: [
          {
            model: models.address,
            attributes: [
              "street_address",
              "city",
              "state",
              "zip_code",
              "street_address2"
            ]
          }
        ]
      },
      {
        model: models.case_officer,
        order: [["created_at", "ASC"]],
        as: "accusedOfficers",
        attributes: [
          [
            models.sequelize.fn(
              "concat_ws",
              " ",
              models.sequelize.col("accusedOfficers.first_name"),
              models.sequelize.col("accusedOfficers.middle_name"),
              models.sequelize.col("accusedOfficers.last_name")
            ),
            "full_name"
          ],
          "windows_username",
          "rank",
          [
            models.sequelize.fn(
              "concat_ws",
              " ",
              models.sequelize.col("accusedOfficers.supervisor_first_name"),
              models.sequelize.col("accusedOfficers.supervisor_middle_name"),
              models.sequelize.col("accusedOfficers.supervisor_last_name")
            ),
            "supervisor_full_name"
          ],
          "supervisor_windows_username",
          "employee_type",
          "district",
          "bureau",
          "work_status",
          [
            models.sequelize.fn(
              "to_char",
              models.sequelize.col("accusedOfficers.hire_date"),
              "MM/DD/YYYY"
            ),
            "hire_date"
          ],
          [
            models.sequelize.fn(
              "to_char",
              models.sequelize.col("accusedOfficers.end_date"),
              "MM/DD/YYYY"
            ),
            "end_date"
          ],
          "race",
          "sex",
          [
            models.sequelize.literal(
              'date_part(\'year\', age("accusedOfficers"."dob"))'
            ),
            "age"
          ],
          "notes"
        ]
      }
    ]
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
    witnessCount: "Number of Witnesses",
    witnessNames: "Witnesses",
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
    "accusedOfficers.notes": "Notes"
  };

  const csvOptions = {
    header: true,
    columns: columns
  };
  stringify(cases, csvOptions, (err, csvOutput) => {
    return response.send(csvOutput);
  });
});

module.exports = exportCases;
