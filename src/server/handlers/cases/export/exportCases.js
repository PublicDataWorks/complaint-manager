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
    "district"
  ];

  const cases = await models.cases.findAll({
    attributes: attributesWithAliases,
    raw: true,
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
    "incidentLocation.street_address2": "Additional Incident Location Info"
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
