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

  await models.sequelize
    .query(`SELECT SETVAL('cases_id_seq', (SELECT MAX(id) + 100 FROM cases), FALSE);
      SELECT SETVAL('addresses_id_seq', (SELECT MAX(id) + 1 FROM addresses), FALSE);
      SELECT SETVAL('allegations_id_seq', (SELECT MAX(id) + 1 FROM allegations), FALSE);
      SELECT SETVAL('attachments_id_seq', (SELECT MAX(id) + 1 FROM attachments), FALSE);
      SELECT SETVAL('audits_id_seq', (SELECT MAX(id) + 1 FROM audits), FALSE);
      SELECT SETVAL('case_classifications_id_seq', (SELECT MAX(id) + 1 FROM case_classifications), FALSE);
      SELECT SETVAL('case_note_actions_id_seq', (SELECT MAX(id) + 1 FROM case_note_actions), FALSE);
      SELECT SETVAL('case_statuses_id_seq', (SELECT MAX(id) + 1 FROM case_statuses), FALSE);
      SELECT SETVAL('case_tags_id_seq', (SELECT MAX(id) + 1 FROM case_tags), FALSE);
      SELECT SETVAL('cases_inmates_id_seq', (SELECT MAX(id) + 1 FROM cases_inmates), FALSE);
      SELECT SETVAL('cases_officers_id_seq', (SELECT MAX(id) + 1 FROM cases_officers), FALSE);
      SELECT SETVAL('civilian_titles_id_seq', (SELECT MAX(id) + 1 FROM civilian_titles), FALSE);
      SELECT SETVAL('civilians_id_seq', (SELECT MAX(id) + 1 FROM civilians), FALSE);
      SELECT SETVAL('complainant_letters_id_seq', (SELECT MAX(id) + 1 FROM complainant_letters), FALSE);
      SELECT SETVAL('complaint_types_id_seq', (SELECT MAX(id) + 1 FROM complaint_types), FALSE);
      SELECT SETVAL('directives_id_seq', (SELECT MAX(id) + 1 FROM directives), FALSE);
      SELECT SETVAL('districts_id_seq', (SELECT MAX(id) + 1 FROM districts), FALSE);
      SELECT SETVAL('facilities_id_seq', (SELECT MAX(id) + 1 FROM facilities), FALSE);
      SELECT SETVAL('gender_identities_id_seq', (SELECT MAX(id) + 1 FROM gender_identities), FALSE);
      SELECT SETVAL('housing_units_id_seq', (SELECT MAX(id) + 1 FROM housing_units), FALSE);
      SELECT SETVAL('how_did_you_hear_about_us_sources_id_seq', (SELECT MAX(id) + 1 FROM how_did_you_hear_about_us_sources), FALSE);
      SELECT SETVAL('intake_sources_id_seq', (SELECT MAX(id) + 1 FROM intake_sources), FALSE);
      SELECT SETVAL('letter_images_id_seq', (SELECT MAX(id) + 1 FROM letter_images), FALSE);
      SELECT SETVAL('letter_input_pages_id_seq', (SELECT MAX(id) + 1 FROM letter_input_pages), FALSE);
      SELECT SETVAL('letter_types_id_seq', (SELECT MAX(id) + 1 FROM letter_types), FALSE);
      SELECT SETVAL('letter_types_letter_images_id_seq', (SELECT MAX(id) + 1 FROM letter_types_letter_images), FALSE);
      SELECT SETVAL('letters_id_seq', (SELECT MAX(id) + 1 FROM letters), FALSE);
      SELECT SETVAL('new_classifications_id_seq', (SELECT MAX(id) + 1 FROM classifications c), FALSE);
      SELECT SETVAL('notifications_id_seq', (SELECT MAX(id) + 1 FROM notifications), FALSE);
      SELECT SETVAL('officer_history_options_id_seq', (SELECT MAX(id) + 1 FROM officer_history_options), FALSE);
      SELECT SETVAL('officers_allegations_id_seq', (SELECT MAX(id) + 1 FROM officers_allegations), FALSE);
      SELECT SETVAL('officers_id_seq', (SELECT MAX(id) + 1 FROM officers), FALSE);
      SELECT SETVAL('priority_levels_id_seq', (SELECT MAX(id) + 1 FROM priority_levels), FALSE);
      SELECT SETVAL('priority_reasons_id_seq', (SELECT MAX(id) + 1 FROM priority_reasons), FALSE);
      SELECT SETVAL('public_data_visualizations_id_seq', (SELECT MAX(id) + 1 FROM public_data_visualizations), FALSE);
      SELECT SETVAL('race_ethnicities_id_seq', (SELECT MAX(id) + 1 FROM race_ethnicities), FALSE);
      SELECT SETVAL('recommended_actions_id_seq', (SELECT MAX(id) + 1 FROM recommended_actions), FALSE);
      SELECT SETVAL('referral_letter_officer_history_notes_id_seq', (SELECT MAX(id) + 1 FROM referral_letter_officer_history_notes), FALSE);
      SELECT SETVAL('referral_letter_officer_recommended_actions_id_seq', (SELECT MAX(id) + 1 FROM referral_letter_officer_recommended_actions), FALSE);
      SELECT SETVAL('referral_letter_officers_id_seq', (SELECT MAX(id) + 1 FROM letter_officers), FALSE);
      SELECT SETVAL('referral_letters_id_seq', (SELECT MAX(id) + 1 FROM referral_letters), FALSE);
      SELECT SETVAL('rule_chapters_id_seq', (SELECT MAX(id) + 1 FROM rule_chapters), FALSE);
      SELECT SETVAL('signers_id_seq', (SELECT MAX(id) + 1 FROM signers), FALSE);
      SELECT SETVAL('tags_id_seq', (SELECT MAX(id) + 1 FROM tags), FALSE);
    `);
};

uploadAnonymizedData();
