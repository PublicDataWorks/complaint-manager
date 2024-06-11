const models = require("../policeDataManager/models");
const DataAnonymizer = require("data-anonymizer");
const fs = require("fs");

const ANONYMIZED_FIELDS = {
  action_audit: ["user"],
  address: [
    "streetAddress",
    "streetAddress2",
    "city",
    "state",
    "zipCode",
    "country",
    "intersection",
    "lat",
    "lng",
    "placeId",
    "additionalLocationInfo"
  ],
  attachment: ["fileName", "description"],
  audit: ["user"],
  case_note: ["user", "notes"],
  cases: [
    "narrativeDetails",
    "createdBy",
    "assignedTo",
    "narrativeSummary",
    "caseNumber",
    "pibCaseNumber"
  ],
  caseInmate: [
    "notes",
    "firstName",
    "middleInitial",
    "lastName",
    "suffix",
    "inmateId",
    "notFoundInmateId",
    "facility"
  ],
  case_officer: [
    "notes",
    "firstName",
    "middleName",
    "lastName",
    "employeeId",
    "supervisorFirstName",
    "supervisorMiddleName",
    "supervisorLastName",
    "supervisorEmployeeId",
    "dob",
    "endDate",
    "hireDate",
    "phoneNumber",
    "email"
  ],
  civilian: [
    "firstName",
    "middleInitial",
    "lastName",
    "birthDate",
    "suffix",
    "email",
    "phoneNumber",
    "additionalInfo"
  ],
  complainant_letter: ["finalPdfFilename"],
  data_change_audit: ["modelDescription", "snapshot", "changes"],
  facility: ["name", "abbreviation", "address"],
  file_audit: ["fileName"],
  inmate: [
    "inmateId",
    "firstName",
    "lastName",
    "region",
    "facility",
    "locationSub1",
    "locationSub2",
    "locationSub3",
    "locationSub4",
    "housing",
    "currentLocation",
    "muster",
    "classificationDate",
    "bookingStartDate",
    "tentativeReleaseDate",
    "bookingEndDate",
    "actualReleaseDate",
    "dateOfBirth",
    "age",
    "dateDeathRecorded",
    "sentenceLength",
    "transferDate",
    "address"
  ],
  legacy_data_change_audit: ["snapshot", "changes", "modelDescription", "user"],
  letter_officer: ["historicalBehaviorNotes", "recommendedActionNotes"],
  letter: [
    "recipient",
    "recipientAddress",
    "sender",
    "transcribedBy",
    "editedLetterHtml",
    "finalPdfFilename"
  ],
  notification: ["user"],
  officer: [
    "firstName",
    "middleName",
    "lastName",
    "employeeId",
    "supervisorEmployeeId",
    "dob",
    "endDate",
    "hireDate"
  ],
  officer_allegation: ["details"],
  referral_letter_officer_history_note: ["details", "pibCaseNumber"],
  referral_letter: [
    "recipient",
    "sender",
    "transcribedBy",
    "editedLetterHtml",
    "finalPdfFilename",
    "recipientAddress"
  ]
};

const anonymizeField = value => {
  const anonymizer = new DataAnonymizer();
  if (value === null || value === undefined) {
    return undefined;
  } else if (typeof value === "number") {
    return parseInt(anonymizer.anonymize("" + value));
  } else if (Array.isArray(value)) {
    return value.map(anonymizeField);
  } else if (typeof value === "object") {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = anonymizeField(value[key]);
      return acc;
    }, {});
  } else if (typeof value === "string") {
    return anonymizer.anonymize(value);
  } else {
    return value;
  }
};

const anonymizeTable = async (modelName, data) => {
  const fields = ANONYMIZED_FIELDS[modelName];
  return data.map(row => {
    const jsonRow = row.toJSON();
    return Object.keys(jsonRow).reduce((acc, key) => {
      if (fields && fields.includes(key) && jsonRow[key]) {
        acc[key] = anonymizeField(jsonRow[key]);
      } else {
        acc[key] = jsonRow[key];
      }
      return acc;
    }, {});
  });
};

async function pullAnonymizedData() {
  const data = {};

  for (const modelName in models) {
    const model = models[modelName];
    if (model.findAll) {
      const attributes = Object.entries(model.rawAttributes)
        .filter(
          ([_, attribute]) =>
            attribute.type && attribute.type.constructor.key !== "VIRTUAL"
        )
        .map(([key, _]) => key);

      const results = await model.findAll({
        attributes // This will only include non-virtual fields
      });

      data[modelName] = await anonymizeTable(modelName, results);
    }
  }

  const jsonData = JSON.stringify(data);
  fs.writeFileSync("anonymizedData.json", jsonData);
}

pullAnonymizedData();
