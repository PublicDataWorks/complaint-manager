const models = require("../policeDataManager/models");
const { cleanupDatabase } = require("../testHelpers/requestTestHelpers");
const fs = require("fs");

const BASIC_TABLES = [
  "caseStatus",
  "intake_source",
  "priority_reasons",
  "priority_levels",
  "how_did_you_hear_about_us_source",
  "district",
  "status",
  "complaintTypes",
  "personType",
  "facility",
  "housing_unit",
  "tag",
  "inmate",
  "officer",
  "publicDataVisualization",
  "signers"
];
const TABLES_THAT_REQUIRE_CASE = [
  "case_tag",
  "case_note",
  "referral_letter",
  "action_audit",
  "legacy_data_change_audit",
  "case_classification",
  "caseInmate",
  "case_officer",
  "attachment",
  "civilian",
  "audit"
];
const TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE = [
  "address",
  "complainant_letter",
  "data_access_audit",
  "data_access_value",
  "data_change_audit",
  "export_audit",
  "file_audit",
  "legacy_data_access_audit",
  "letter_officer",
  "notification",
  "officer_allegation"
];
const TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE = [
  "referral_letter_officer_history_note",
  "referral_letter_officer_recommended_action"
];

const calculateValue = modelName => {
  if (BASIC_TABLES.includes(modelName)) {
    return -1;
  } else if (TABLES_THAT_REQUIRE_CASE.includes(modelName)) {
    return 1;
  } else if (TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(modelName)) {
    return 2;
  } else if (
    TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(
      modelName
    )
  ) {
    return 3;
  } else {
    return 0;
  }
};

const sortModelNames = (m1, m2) => {
  const v1 = calculateValue(m1);
  const v2 = calculateValue(m2);
  if (v1 === v2) {
    return m1.localeCompare(m2);
  } else {
    return v1 - v2;
  }
};

const uploadAnonymizedData = async () => {
  await cleanupDatabase();
  const modelNames = Object.keys(models).sort(sortModelNames);
  for (const modelName of modelNames) {
    const path = `anonymizedData/${modelName}.json`;
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, "utf8");
      const jsonData = JSON.parse(data);
      for (const row of jsonData) {
        let inputRow = row;
        await models[modelName].create(inputRow, {
          auditUser: "anonymize script"
        });
      }
    } else {
      console.log(`File ${path} does not exist.`);
    }
  }
};

uploadAnonymizedData();
