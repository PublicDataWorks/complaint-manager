const models = require("../policeDataManager/models");
const { cleanupDatabase } = require("../testHelpers/requestTestHelpers");
const fs = require("fs");

const BASIC_TABLES = [
  "intake_source",
  "priority_reasons",
  "priority_levels",
  "how_did_you_hear_about_us_source",
  "district",
  "status",
  "complaintType",
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
  "caseStatus",
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
  "notification"
];

const sortModelNames = (m1, m2) => {
  if (BASIC_TABLES.includes(m1) && !BASIC_TABLES.includes(m2)) {
    return -1;
  }
  if (BASIC_TABLES.includes(m2) && !BASIC_TABLES.includes(m1)) {
    return 1;
  }
  if (
    TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(m1) &&
    !TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(m2)
  ) {
    return 1;
  }
  if (
    TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(m2) &&
    !TABLES_THAT_REQUIRE_TABLES_THAT_REQUIRE_CASE.includes(m1)
  ) {
    return -1;
  }
  if (
    TABLES_THAT_REQUIRE_CASE.includes(m1) &&
    !TABLES_THAT_REQUIRE_CASE.includes(m2)
  ) {
    return 1;
  }
  if (
    TABLES_THAT_REQUIRE_CASE.includes(m2) &&
    !TABLES_THAT_REQUIRE_CASE.includes(m1)
  ) {
    return -1;
  }
  return m1.localeCompare(m2);
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
        await models[modelName].create(row, {
          auditUser: "anonymize script"
        });
      }
    } else {
      console.log(`File ${path} does not exist.`);
    }
  }
};

uploadAnonymizedData();
